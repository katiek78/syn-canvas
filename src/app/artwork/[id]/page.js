"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ArtworkAttribution from "@/components/ArtworkAttribution";

export default function ArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const [artwork, setArtwork] = useState(null); // State to store artwork data
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const artworkId = params.id; // The dynamic parameter from the

  // Fetch the artwork data when the component mounts
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/artworks/${artworkId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setArtwork(data); // Set the fetched artwork data
        } else {
          setMessage("Artwork not found.");
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
        alert("An error occurred while fetching the artwork");
      } finally {
        setLoading(false); // Stop loading after the fetch is complete
      }
    };

    fetchArtwork();
  }, [artworkId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this artwork?"
    );
    if (confirmDelete) {
      try {
        // Send DELETE request to the API route
        const response = await fetch(`/api/artworks/${artworkId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/"); // Redirect to the home/gallery page
        } else {
          alert("Failed to delete artwork");
        }
      } catch (error) {
        console.error("Error deleting artwork:", error);
        alert("An error occurred while deleting the artwork");
      }
    }
  };

  //   if (!artwork) {
  //     return <p>Artwork not found.</p>;
  //   }

  return (
    artwork && (
      <div className="p-6">
        <p>{message}</p>
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Gallery
        </Link>
        <h1 className="text-2xl font-bold">{artwork.title}</h1>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full max-w-lg rounded-lg"
        />
        <p className="text-gray-600 mt-4">{artwork.description}</p>
        <p className="mt-2 font-semibold">Artist: {artwork.artist}</p>
        <ArtworkAttribution {...artwork} />

        {artwork.songs?.map((song, i) => (
          <div key={i}>
            <iframe
              src={`https://open.spotify.com/embed/track/${song.spotifyCode}?utm_source=generator`}
              width="100%"
              height="80"
              allow="autoplay; encrypted-media"
              className="mt-4 rounded-lg"
            ></iframe>
          </div>
        ))}

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded mt-4"
        >
          Delete Artwork
        </button>
      </div>
    )
  );
}
