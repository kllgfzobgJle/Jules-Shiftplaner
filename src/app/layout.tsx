import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/components/DataProvider";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codex Shift Planner",
  description: "A modern shift planning application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <DataProvider>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm">
              <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  Codex Shift Planner
                </Link>
                <div className="flex items-center space-x-6">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link href="/employees" className="text-gray-600 hover:text-gray-900">
                    Mitarbeiter
                  </Link>
                  <Link href="/teams" className="text-gray-600 hover:text-gray-900">
                    Teams
                  </Link>
                  <Link href="/planner" className="text-gray-600 hover:text-gray-900">
                    Planung
                  </Link>
                </div>
              </nav>
            </header>
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <footer className="bg-white mt-8 py-4 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Codex Shift Planner. All rights reserved.</p>
            </footer>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
