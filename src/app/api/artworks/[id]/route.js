import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { requireAdminInEndpoint } from "@/utils/auth";

export async function GET(req, { params }) {
  const { id } = await params;

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
  const user = await requireAdminInEndpoint(req);
  if (!user) return;
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

export async function PUT(req, { params }) {
  const { id } = params;
  const updatedFields = await req.json(); // Get the updated fields from the request body

  if (!updatedFields || Object.keys(updatedFields).length === 0) {
    return new Response(JSON.stringify({ error: "No data provided" }), {
      status: 400,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("artworksDB");

    const result = await db
      .collection("artworks")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });

    if (result.modifiedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Artwork updated successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error updating artwork:", error);
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
      Allow: "PUT, GET, DELETE, OPTIONS",
    },
  });
}
