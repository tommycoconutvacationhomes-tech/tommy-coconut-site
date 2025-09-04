// Netlify Function to handle form submissions to Airtable
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
    console.error('Missing Airtable credentials');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  // Map form data to Airtable fields
  const airtableData = {
    fields: {
      'Name': formData.name || '',
      'Email': formData.email || '',
      'Phone': formData.phone || '',
      'Travel Vibe': formData.travelVibe || '',
      'Group Size': parseInt(formData.groupSize) || 0,
      'Must-Have Feature': formData.mustHaveFeature || '',
      'Budget Range': formData.budgetRange || '',
      'Travel Dates': formData.travelDates || '',
      'Lead Source': 'Website Funnel',
      'Status': 'New',
      'Notes': formData.notes || `Villa Match: ${formData.villaMatch || 'Not specified'}`
    }
  };

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
      const error = await response.text();
      console.error('Airtable error:', error);
      throw new Error('Failed to save to Airtable');
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