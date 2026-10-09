import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorProof AI — AI Content Creator Marketplace",
  description: "AI Content Creator Marketplace with Verified Proof of Work, Cryptographic Prompt Verification & Automated Brief Matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
