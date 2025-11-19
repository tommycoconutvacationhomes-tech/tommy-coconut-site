// Enhanced Netlify Function: Airtable + Mailchimp Integration
// Handles form submissions and sends to both platforms

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the form data
  let formData;
  try {
    formData = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  // Get credentials from environment variables
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., 'us21'
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  // Check required credentials
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    console.error('Missing Airtable credentials');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: Missing Airtable credentials' })
    };
  }

  // Initialize results
  const results = {
    airtable: null,
    mailchimp: null
  };

  // ========================================
  // STEP 1: Submit to Airtable
  // ========================================
  try {
    const airtableData = {
      fields: {
        'Name': formData.name || 'Website Visitor',
        'Status': 'New',
        'Notes': `Email: ${formData.email || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}
Travel Vibe: ${formData.travelVibe || 'Not specified'}
Group Size: ${formData.groupSize || 'Not specified'}
Must-Have Feature: ${formData.mustHaveFeature || 'Not specified'}
Budget Range: ${formData.budgetRange || 'Not specified'}
Travel Dates: ${formData.travelDates || 'Not specified'}
Villa Match: ${formData.villaMatch || 'Not specified'}
Additional Notes: ${formData.notes || 'None'}
Lead Source: ${formData.source || 'Website Funnel'}
Submitted: ${new Date().toISOString()}`
      }
    };

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
      }
    );

    if (airtableResponse.ok) {
      const airtableResult = await airtableResponse.json();
      results.airtable = {
        success: true,
        recordId: airtableResult.id
      };
      console.log('Airtable: Success', airtableResult.id);
    } else {
      const errorText = await airtableResponse.text();
      results.airtable = {
        success: false,
        error: errorText,
        status: airtableResponse.status
      };
      console.error('Airtable: Failed', errorText);
    }
  } catch (error) {
    results.airtable = {
      success: false,
      error: error.message
    };
    console.error('Airtable: Exception', error);
  }

  // ========================================
  // STEP 2: Submit to Mailchimp (if configured)
  // ========================================
  if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX && MAILCHIMP_AUDIENCE_ID && formData.email) {
    try {
      // Determine tags based on form data
      const tags = [];

      // Add source tag
      if (formData.source) {
        tags.push(formData.source);
      } else {
        tags.push('Website');
      }

      // Add property interest tag if available
      if (formData.villaMatch && formData.villaMatch !== 'Not sure yet') {
        tags.push(`Interest: ${formData.villaMatch}`);
      }

      // Add funnel stage tag
      if (formData.travelDates && formData.travelDates !== 'Not sure yet') {
        tags.push('Hot Lead');
      } else {
        tags.push('Research Phase');
      }

      // Build Mailchimp merge fields
      const mergeFields = {
        FNAME: formData.name ? formData.name.split(' ')[0] : '',
        LNAME: formData.name ? formData.name.split(' ').slice(1).join(' ') : '',
      };

      // Add custom merge fields if you've set them up in Mailchimp
      if (formData.phone) {
        mergeFields.PHONE = formData.phone;
      }
      if (formData.travelDates) {
        mergeFields.TRVLDATES = formData.travelDates;
      }
      if (formData.groupSize) {
        mergeFields.GRPSIZE = formData.groupSize;
      }

      const mailchimpData = {
        email_address: formData.email,
        status: 'subscribed', // or 'pending' for double opt-in
        merge_fields: mergeFields,
        tags: tags,
        timestamp_signup: new Date().toISOString()
      };

      const mailchimpResponse = await fetch(
        `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mailchimpData)
        }
      );

      if (mailchimpResponse.ok || mailchimpResponse.status === 400) {
        // 400 might mean member already exists - that's okay
        const mailchimpResult = await mailchimpResponse.json();

        if (mailchimpResponse.ok) {
          results.mailchimp = {
            success: true,
            subscriberId: mailchimpResult.id,
            status: mailchimpResult.status
          };
          console.log('Mailchimp: Success', mailchimpResult.id);
        } else if (mailchimpResult.title === 'Member Exists') {
          // Member already exists - update their tags instead
          const subscriberHash = require('crypto')
            .createHash('md5')
            .update(formData.email.toLowerCase())
            .digest('hex');

          const updateResponse = await fetch(
            `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}/tags`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                tags: tags.map(name => ({ name, status: 'active' }))
              })
            }
          );

          results.mailchimp = {
            success: true,
            note: 'Updated existing subscriber with new tags'
          };
          console.log('Mailchimp: Updated existing subscriber');
        }
      } else {
        const errorText = await mailchimpResponse.text();
        results.mailchimp = {
          success: false,
          error: errorText,
          status: mailchimpResponse.status
        };
        console.error('Mailchimp: Failed', errorText);
      }
    } catch (error) {
      results.mailchimp = {
        success: false,
        error: error.message
      };
      console.error('Mailchimp: Exception', error);
    }
  } else {
    results.mailchimp = {
      success: false,
      note: 'Mailchimp not configured or no email provided'
    };
  }

  // ========================================
  // RETURN COMBINED RESULTS
  // ========================================

  // Determine overall success
  const overallSuccess = results.airtable?.success || results.mailchimp?.success;

  return {
    statusCode: overallSuccess ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: overallSuccess,
      message: overallSuccess
        ? 'Lead captured successfully'
        : 'Failed to capture lead',
      details: results
    })
  };
};
