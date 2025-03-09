import clientPromise from "../../../lib/mongodb";
import { requireAdminInEndpoint } from "@/utils/auth";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("artworksDB");
    const artworks = await db.collection("artworks").find({}).toArray();

    return new Response(JSON.stringify(artworks), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Failed to fetch artworks", { status: 500 });
  }
}

export async function POST(request) {
  const user = await requireAdminInEndpoint(request);
  if (!user) return;
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("artworksDB");
    const result = await db.collection("artworks").insertOne(data);

    return new Response(
      JSON.stringify({
        message: "Artwork added",
        artworkId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to save artwork", { status: 500 });
  }
}

// Fallback for unsupported methods
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // No content, but allows preflight requests
    headers: {
      Allow: "POST, GET, OPTIONS",
    },
  });
}
