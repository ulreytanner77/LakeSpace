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
      <body
          className="text-stone-800 min-h-screen"
          style={{ background: "linear-gradient(to bottom, #4a8a9970 0%, #d4eef820 35%, #fdf8f0 60%)" }}
        >
        <header className="shadow-md" style={{ background: "linear-gradient(135deg, #3D8968 0%, #4A9E7A 40%, #E6B34E 100%)" }}>
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/lakes" className="text-xl font-extrabold text-sand-50 hover:text-sunset-400 transition-colors">
              Lake Space
            </a>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
