import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gravity Protocol — Stellar Asset Core",
  description: "Gravity Protocol — Decentralized yield generation and asset management on Stellar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
