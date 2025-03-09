"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export function useRequireAdmin() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Handle the redirection inside a useEffect, only after loading is finished.
  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push("/"); // Redirect non-admin users
    }
  }, [isLoading, user, router]);

  return {
    isLoading,
    isAdmin: user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  };
}
