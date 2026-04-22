import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYORAA — House of Beauty",
  description: "Six iconic brands. One vision. Crafting transformative personal care rooted in pure ingredients and breakthrough science.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
