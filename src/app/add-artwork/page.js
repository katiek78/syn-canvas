"use client";

import { useRouter } from "next/navigation";
import ArtworkForm from "@/components/ArtworkForm";
import { useRequireAdmin } from "@/utils/requireLogin";

export default function AddArtwork() {
  const { isLoading, isAdmin } = useRequireAdmin();

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;

  return <ArtworkForm />;
}
