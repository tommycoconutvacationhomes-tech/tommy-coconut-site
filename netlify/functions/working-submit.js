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

  // Map form data to match your Airtable fields
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
Lead Source: Website Form
Submitted: ${new Date().toISOString()}`
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