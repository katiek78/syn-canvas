import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

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
