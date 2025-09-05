// Netlify Function to handle form submissions to Airtable
// Updated token - redeploy trigger
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

  // Get Airtable credentials from environment variables
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT; // Personal Access Token
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    console.error('Missing Airtable credentials:', {
      hasToken: !!AIRTABLE_PAT,
      hasBaseId: !!AIRTABLE_BASE_ID,
      tokenLength: AIRTABLE_PAT ? AIRTABLE_PAT.length : 0,
      baseIdLength: AIRTABLE_BASE_ID ? AIRTABLE_BASE_ID.length : 0
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        details: {
          hasToken: !!AIRTABLE_PAT,
          hasBaseId: !!AIRTABLE_BASE_ID
        }
      })
    };
  }

  // Map form data to Airtable fields
  // Log the mapping for debugging
  console.log('Mapping form data:', formData);
  
  // Only send fields that exist in your Airtable
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
Lead Source: Website Funnel`
    }
  };
  
  console.log('Sending to Airtable:', JSON.stringify(airtableData));

  // Send to Airtable
  try {
    const response = await fetch(
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`
      });
      
      // Parse error for more details
      let errorDetails = {};
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {
        errorDetails = { rawError: errorText };
      }
      
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Airtable API error',
          status: response.status,
          details: errorDetails,
          hint: response.status === 404 ? 'Check that your base ID is correct and table is named "Leads"' :
                response.status === 401 ? 'Check your Personal Access Token' :
                response.status === 403 ? 'Check token permissions (needs data.records:write)' :
                'Check Airtable configuration'
        })
      };
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Lead captured successfully',
        recordId: result.id 
      })
    };
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process submission' })
    };
  }
};