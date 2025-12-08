import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "Azul Pool Service - Professional Pool Maintenance in San Antonio",
  description: "Professional pool service and maintenance in San Antonio, TX. Weekly cleaning, equipment repair, and filter cleaning. Get your instant quote today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
