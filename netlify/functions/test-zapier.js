// Test function to send sample data to Zapier webhook
exports.handler = async (event, context) => {
  // Sample form data that matches what your real forms send
  const sampleData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    travel_vibe: 'Luxury & Relaxation',
    group_size: 4,
    must_have_feature: 'Private Pool',
    budget_range: '$800-1200/night',
    travel_dates: 'March 2024',
    villa_match: 'Villa Sunset Dreams',
    user_preferences: 'Beach access, Modern amenities, Quiet location',
    lead_source: 'Personal Curation Experience',
    timestamp: new Date().toISOString(),
    website_url: 'https://tommy-coconut-site.netlify.app/treasure-map.html'
  };

  try {
    // Send to your Zapier webhook
    const response = await fetch('https://hooks.zapier.com/hooks/catch/12863026/uddzzjj/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleData)
    });

    const responseText = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: response.ok,
        status: response.status,
        zapierResponse: responseText,
        sentData: sampleData,
        message: response.ok ? 
          'Test data sent to Zapier successfully! Check your Zapier dashboard.' : 
          'Error sending to Zapier'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        sentData: sampleData
      })
    };
  }
};