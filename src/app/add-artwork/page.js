"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddArtwork() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [source, setSource] = useState("");
  const [licence, setLicence] = useState("");
  const router = useRouter();

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newArtwork = {
      title,
      artist,
      imageUrl,
      source,
      licence,
    };

    // Call your API to add the artwork to MongoDB
    const res = await fetch("/api/artworks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArtwork),
    });

    if (res.ok) {
      // Redirect back to the gallery page after successful addition
      router.push("/");
    } else {
      console.error("Failed to add artwork");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4">Add Artwork</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <div>
          <label className="block">Licence</label>
          <input
            type="text"
            value={licence}
            onChange={(e) => setLicence(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Artwork
        </button>
      </form>
    </div>
  );
}
