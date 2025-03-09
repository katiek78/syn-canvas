import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import LoginButton from "@/components/LoginButton";

export const metadata = {
  title: "SynCanvas",
  description: "Match music to art",
};

export default function RootLayout({ children }) {
  console.log(UserProvider);
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center">SynCanvas</h1>
                <p className="text-center text-gray-600">
                  Discover the perfect musical companion for classic artworks
                </p>
                <LoginButton />
              </div>
            </header>
            <main className="max-w-7xl mx-auto p-4">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
