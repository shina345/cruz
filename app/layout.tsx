import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";

// Favicon will be set inside RootLayout return
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRUZ | Modern Luxury Fashion Archive",
  description: "A showcase of modern, minimalist, premium contemporary fashion.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/cruz_logo.png",
    apple: "/cruz_logo.png"
  },
  openGraph: {
    title: "CRUZ | Modern Luxury Fashion Archive",
    description: "Explore our premium contemporary fashion collection.",
    url: "https://your-domain.com",
    siteName: "CRUZ",
    images: [{ url: "/cruz_logo.png" }],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRUZ | Modern Luxury Fashion Archive",
    description: "Explore our premium contemporary fashion collection.",
    images: ["/cruz_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

        <body className={`${playfair.variable} bg-cruzBg text-cruzBlack font-sans antialiased selection:bg-cruzBlack selection:text-cruzBg overflow-x-hidden`}>
          <Header />
          {children}
          <Footer />
          <MusicPlayer />
          <div className="film-grain" />
        </body>
    </html>
  );
}
