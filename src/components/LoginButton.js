"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function LoginButton() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="block text-gray-500">Signed in as</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <img
          src={user.picture}
          alt={user.name}
          className="h-8 w-8 rounded-full"
        />
        <a
          href="/api/auth/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Log Out
        </a>
      </div>
    );
  }

  // return (
  //   {/* <a
  //     href="/api/auth/login"
  //     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
  //   >
  //     Log In
  //   </a> */}
  // );
}
