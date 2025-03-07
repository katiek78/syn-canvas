"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ArtworkForm({ initialData }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [artist, setArtist] = useState(initialData.artist || "");
  const [year, setYear] = useState(initialData.year || "");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [source, setSource] = useState(initialData.source || "");
  const [licence, setLicence] = useState(initialData.licence || "");
  const router = useRouter();
  const params = useParams();
  const artworkId = params.id;

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentArtwork = {
      title,
      artist,
      year,
      imageUrl,
      source,
      licence,
    };

    let res;

    if (initialData) {
      //update
      try {
        res = await fetch(`/api/artworks/${artworkId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentArtwork),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to update artwork");
        }

        console.log("Artwork updated successfully");
      } catch (error) {
        console.error("Error updating artwork:", error);
      }
    } else {
      //add
      res = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentArtwork),
      });
    }
    if (res.ok) {
      // Redirect back to the gallery page after successful addition
      router.push("/");
    } else {
      console.error("Failed to save changes");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4">
        {initialData ? "Edit Artwork" : "Add Artwork"}
      </h1>

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
          <label className="block">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
          {initialData ? "Save" : "Add"}
        </button>
      </form>
    </div>
  );
}
