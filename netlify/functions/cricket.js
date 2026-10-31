exports.handler = async function () {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const apiKey = process.env.CRICKETDATA_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "CRICKETDATA_API_KEY is not configured"
        })
      };
    }

    const response = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${apiKey}`
    );

    const result = await response.json();

    return {
      statusCode: response.ok ? 200 : response.status,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
