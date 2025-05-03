export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();

    // Forward the request to the actual RPC endpoint
    const response = await fetch('https://devnet.dplabs-internal.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await response.json();

    // Return the response with CORS headers
    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return Response.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  );
}
