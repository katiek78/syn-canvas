import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { requireAdminInEndpoint } from "@/utils/auth";

// Add a song to an artwork
export async function PUT(req, { params }) {
  const { id } = params;
  const { spotifyId } = await req.json(); // Get the Spotify ID from the request body

  if (!spotifyId) {
    return new Response(JSON.stringify({ error: "Missing Spotify ID" }), {
      status: 400,
    });
  }

  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db("artworksDB");

    const result = await db.collection("artworks").updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { songs: spotifyId } } // Ensure no duplicate song entries
    );

    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Song added successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error adding song:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// Remove a song from an artwork
export async function DELETE(req, { params }) {
  const user = await requireAdminInEndpoint(req);
  if (!user) return;

  const { id } = params;
  const { spotifyId } = await req.json(); // Get the Spotify ID from the request body

  if (!spotifyId) {
    return new Response(JSON.stringify({ error: "Missing Spotify ID" }), {
      status: 400,
    });
  }

  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db("artworksDB");

    const result = await db
      .collection("artworks")
      .updateOne({ _id: new ObjectId(id) }, { $pull: { songs: spotifyId } });

    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Song removed successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error removing song:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// Fallback for unsupported methods
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // No content, but allows preflight requests
    headers: {
      Allow: "PUT, DELETE, OPTIONS",
    },
  });
}
