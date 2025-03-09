import { getSession } from "@auth0/nextjs-auth0";

export async function requireAdminInEndpoint(request) {
  const session = await getSession(request);
  const user = session?.user;

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null; // Return null for unauthorised users
  }

  return user; // Return user if valid
}
