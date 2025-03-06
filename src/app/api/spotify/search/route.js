export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter is required" }),
      { status: 400 }
    );
  }

  // Get Spotify Token
  const tokenRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/token`
  );
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response(
      JSON.stringify({ error: "Failed to get access token" }),
      { status: 500 }
    );
  }

  // Search Spotify
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.ok ? 200 : response.status,
  });
}
