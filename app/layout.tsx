import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYORAA — House of Brands",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    fontFamily: {
                      raleway: ['Raleway', 'sans-serif'],
                    },
                    colors: {
                      linen: {
                        50:  '#fdfcfa',
                        100: '#f8f6f2',
                        200: '#f3f0eb',
                        300: '#e8e4de',
                        400: '#d5cfc6',
                        500: '#c0bab1',
                        600: '#9a958e',
                        700: '#6a6560',
                        800: '#3a3630',
                        900: '#1a1814',
                      },
                    },
                    screens: {
                      'xs': '375px',
                      '3xl': '1920px',
                      '4xl': '2560px',
                    },
                  },
                },
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
