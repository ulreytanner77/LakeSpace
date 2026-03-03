import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lake Space",
  description: "Pick a lake. Share photos, conditions, and chat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/lakes" className="text-lg font-bold text-blue-600">
              Lake Space
            </a>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
