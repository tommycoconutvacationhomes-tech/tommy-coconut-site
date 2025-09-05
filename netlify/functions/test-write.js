// Test writing a simple record to Airtable
exports.handler = async (event, context) => {
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing credentials' })
    };
  }

  // Very simple test data - just the required field
  const testData = {
    fields: {
      'Name': 'Test from Netlify ' + new Date().toISOString()
    }
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      }
    );

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { rawText: responseText };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        result: result,
        testData: testData,
        url: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`,
        hint: response.status === 404 ? 'Table "Leads" not found' :
              response.status === 401 ? 'Invalid token' :
              response.status === 403 ? 'Token needs data.records:write permission' :
              response.status === 422 ? 'Field names might not match your table' :
              response.ok ? 'Success!' : 'Check the result for details'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
};