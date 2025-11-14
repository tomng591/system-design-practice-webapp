import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "System Design Practice",
  description: "Practice system design with interactive examples",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
