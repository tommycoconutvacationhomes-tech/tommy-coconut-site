// Simple test function
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      message: 'Function is working!',
      method: event.httpMethod,
      timestamp: new Date().toISOString()
    })
  };
};