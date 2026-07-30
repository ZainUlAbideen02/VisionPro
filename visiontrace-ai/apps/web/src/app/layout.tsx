import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisionTrace AI — Multi-Tenant Visual Video Search",
  description: "Extract keyframes, vector vectorize with SigLIP 2, and search video scenes using natural language queries with instant timestamp jumping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-surface-dark text-slate-100 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
