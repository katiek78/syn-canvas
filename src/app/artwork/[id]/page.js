"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ArtworkAttribution from "@/components/ArtworkAttribution";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const [artwork, setArtwork] = useState(null); // State to store artwork data
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { user, isLoading } = useUser();

  const artworkId = params.id;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearchOpen(true);
    try {
      const res = await fetch(`/api/spotify/search?query=${query}`);
      const data = await res.json();
      setResults(data.tracks.items || []);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  const handleAddSong = async (song) => {
    try {
      const res = await fetch(`/api/artworks/${artworkId}/songs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyId: song.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to add song");
      }

      console.log("Song added successfully");
      setArtwork({ ...artwork, songs: [...(artwork.songs || []), song.id] });
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

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

  const handleEdit = () => {
    router.push(`/artwork/${artworkId}/edit`); // Navigate to the edit page
  };

  /**
   * Deletes the artwork with the given ID from the database.
   * Redirects to the home/gallery page if successful.
   * Displays an alert with an error message if the deletion fails.
   */
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
        <p className="text-gray-600 mt-4">{artwork.year}</p>
        <p className="mt-2 font-semibold">Artist: {artwork.artist}</p>
        <ArtworkAttribution {...artwork} />

        {user && (
          <>
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 mr-2"
            >
              Edit Artwork
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4"
            >
              Delete Artwork
            </button>
          </>
        )}

        {(!artwork.songs || artwork.songs.length === 0) && (
          <p className="mt-4 text-lg font-semibold text-gray-700">
            No musical pairings have been added for this artwork yet. Why not
            search for a song on Spotify?
          </p>
        )}

        {/* SEARCH BOX */}
        <div className="mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song..."
            className="border px-4 py-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Search
          </button>
          {isSearchOpen && results && results.length > 0 && (
            <button
              onClick={handleCloseSearch}
              className="bg-gray-800 text-white px-4 py-2 rounded mt-2 ml-2"
            >
              Close search
            </button>
          )}
        </div>

        {/* SEARCH RESULTS */}
        <div className="mt-4">
          {isSearchOpen &&
            results.map((song) => (
              <div key={song.id} className="border p-2 rounded mb-2">
                <p className="font-semibold">
                  {song.name} - {song.artists[0].name}
                </p>
                <iframe
                  src={`https://open.spotify.com/embed/track/${song.id}`}
                  width="100%"
                  height="80"
                  allow="autoplay; encrypted-media"
                  className="rounded-lg"
                ></iframe>
                <button
                  onClick={() => handleAddSong(song)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Add
                </button>
              </div>
            ))}
        </div>

        {artwork.songs?.map((song, i) => (
          <div key={i}>
            <iframe
              src={`https://open.spotify.com/embed/track/${song}?utm_source=generator`}
              width="100%"
              height="80"
              allow="autoplay; encrypted-media"
              className="mt-4 rounded-lg"
            ></iframe>
          </div>
        ))}
      </div>
    )
  );
}
