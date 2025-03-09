"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArtworkForm from "@/components/ArtworkForm";
import { useRequireAdmin } from "@/utils/requireLogin";

export default function EditArtworkPage() {
  const params = useParams();
  const artworkId = params.id;
  const [artworkData, setArtworkData] = useState(null);
  const { isLoading, isAdmin } = useRequireAdmin();

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;

  useEffect(() => {
    if (artworkId) {
      fetch(`/api/artworks/${artworkId}`)
        .then((res) => res.json())
        .then((data) => setArtworkData(data))
        .catch((err) => console.error(err));
    }
  }, [artworkId]);

  if (!artworkData) return <div>Loading...</div>;

  return (
    <div>
      <ArtworkForm initialData={artworkData} />
    </div>
  );
}
