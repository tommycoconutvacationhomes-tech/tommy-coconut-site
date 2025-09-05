// Ultra simple test - just send Name field
exports.handler = async (event, context) => {
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  // Return environment info for debugging
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Missing credentials',
        hasToken: !!AIRTABLE_PAT,
        hasBaseId: !!AIRTABLE_BASE_ID,
        tokenStart: AIRTABLE_PAT ? AIRTABLE_PAT.substring(0, 5) + '...' : 'missing',
        baseId: AIRTABLE_BASE_ID || 'missing'
      })
    };
  }

  // Try to write the simplest possible record
  const data = {
    fields: {
      'Name': 'Simple Test ' + new Date().getTime()
    }
  };

  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: response.ok,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        responseBody: responseText,
        sentData: data,
        url: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`,
        tokenStart: AIRTABLE_PAT.substring(0, 5) + '...',
        baseId: AIRTABLE_BASE_ID
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: error.message,
        tokenStart: AIRTABLE_PAT.substring(0, 5) + '...',
        baseId: AIRTABLE_BASE_ID
      })
    };
  }
};