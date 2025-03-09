"use client";

import React, { useState, useEffect } from "react";
import { Search, Music } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ArtworkGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState(null);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [error, setError] = useState(null);
  const { user, isLoading } = useUser();

  // Filter artworks based on search query
  useEffect(() => {
    if (!artworks?.length) return;

    if (searchQuery) {
      const filtered = artworks.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtworks(filtered);
    } else {
      setFilteredArtworks(artworks);
    }
  }, [searchQuery, artworks]);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch("/api/artworks");
        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchArtwork();
  }, []);

  //   if (error) return <div>{error}</div>;
  //   if (!artwork) return <div>Loading...</div>;

  return (
    <div>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search by artwork title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute right-3 text-gray-400" />
        </div>
      </div>

      {user && (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/add-artwork">Add Artwork</Link>
        </button>
      )}
      {/* Artwork Grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredArtworks?.map((artwork) => (
          <Link
            key={artwork._id}
            href={`/artwork/${artwork._id}`}
            className="rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            <div className="relative h-48 w-full">
              {artwork.imageUrl && (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{artwork.title}</h3>
              <p className="text-gray-600">
                {artwork.artist} ({artwork.year})
              </p>
              <div className="flex items-center mt-2 text-gray-500">
                <span className="inline-flex items-center">
                  <Music className="w-4 h-4 mr-1" />
                  {artwork.songs?.length || 0} musical pairings
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
