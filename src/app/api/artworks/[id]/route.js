import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db("artworksDB");

    // Find the artwork with the specified id
    const artwork = await db
      .collection("artworks")
      .findOne({ _id: new ObjectId(id) });

    // Check if artwork exists
    if (!artwork) {
      return new Response(JSON.stringify({ message: "Artwork not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the artwork as a JSON response
    return new Response(JSON.stringify(artwork), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch artwork", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // Get the artwork ID from the URL parameters

  try {
    const client = await clientPromise;
    const db = client.db("artworksDB");
    // Delete the artwork with the given ID
    const result = await db
      .collection("artworks")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Artwork deleted successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
