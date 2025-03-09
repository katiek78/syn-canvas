"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAdmin } from "@/utils/requireLogin";
import ArtworkForm from "@/components/ArtworkForm";

export default function EditArtworkPage() {
  const params = useParams();
  const artworkId = params.id;
  const { isLoading, isAdmin } = useRequireAdmin();

  const [artworkData, setArtworkData] = useState(null);

  useEffect(() => {
    if (artworkId) {
      fetch(`/api/artworks/${artworkId}`)
        .then((res) => res.json())
        .then((data) => setArtworkData(data))
        .catch((err) => console.error(err));
    }
  }, [artworkId]);

  if (isLoading || !artworkData) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;

  return (
    <div>
      <ArtworkForm initialData={artworkData} />
    </div>
  );
}
