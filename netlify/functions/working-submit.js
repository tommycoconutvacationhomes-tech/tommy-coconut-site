// Working version of form submission
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  // Get Airtable credentials
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  // Map form data to match your Airtable fields - only use fields that work
  const airtableData = {
    fields: {
      'Name': formData.name || 'Website Visitor',
      'Notes': `EMAIL: ${formData.email || 'Not provided'}
PHONE: ${formData.phone || 'Not provided'}
TRAVEL VIBE: ${formData.travelVibe || 'Not specified'}
GROUP SIZE: ${formData.groupSize || 'Not specified'}
MUST-HAVE FEATURE: ${formData.mustHaveFeature || 'Not specified'}
BUDGET RANGE: ${formData.budgetRange || 'Not specified'}
TRAVEL DATES: ${formData.travelDates || 'Not specified'}
VILLA MATCH: ${formData.villaMatch || 'Not specified'}
ADDITIONAL NOTES: ${formData.notes || 'None'}

LEAD SOURCE: Website Form
STATUS: New Lead
SUBMITTED: ${new Date().toLocaleString()}`
    }
  };

  // Send to Airtable
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'Airtable error',
          status: response.status,
          details: errorText
        })
      };
    }

    const result = await response.json();
    
    // Also send to Zapier webhook for email notifications
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/12863026/uddzzjj/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    } catch (zapierError) {
      console.log('Zapier webhook error (non-critical):', zapierError.message);
    }

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
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to process submission: ' + error.message })
    };
  }
};