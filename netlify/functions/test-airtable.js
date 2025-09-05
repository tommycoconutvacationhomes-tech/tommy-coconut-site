// Simple test function to verify Airtable connection
exports.handler = async (event, context) => {
  // Only allow GET requests for this test
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get credentials
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  // Check if credentials exist
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        status: 'Missing credentials',
        hasToken: !!AIRTABLE_PAT,
        hasBaseId: !!AIRTABLE_BASE_ID,
        tokenLength: AIRTABLE_PAT ? AIRTABLE_PAT.length : 0,
        baseIdLength: AIRTABLE_BASE_ID ? AIRTABLE_BASE_ID.length : 0
      })
    };
  }

  // Try to fetch records from Airtable to test connection
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads?maxRecords=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { rawResponse: responseText };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: response.ok ? 'Connection successful!' : 'Connection failed',
        httpStatus: response.status,
        httpStatusText: response.statusText,
        baseId: AIRTABLE_BASE_ID,
        tokenFirstChars: AIRTABLE_PAT.substring(0, 4) + '...',
        apiResponse: responseData,
        hint: response.status === 404 ? 'Table "Leads" not found or Base ID incorrect' :
              response.status === 401 ? 'Invalid token' :
              response.status === 403 ? 'Token lacks permissions for this base' :
              response.ok ? 'Everything looks good!' : 'Unknown error'
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'Error during test',
        error: error.message,
        baseId: AIRTABLE_BASE_ID,
        tokenFirstChars: AIRTABLE_PAT.substring(0, 4) + '...'
      })
    };
  }
};