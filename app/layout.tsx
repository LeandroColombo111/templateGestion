import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sora, Space_Grotesk } from "next/font/google";
import Providers from "./providers";

const sora = Sora({ subsets: ["latin"], variable: "--font-display" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Anti-Phishing Lab",
  description: "Demo SaaS for triaging emails and detecting phishing signals"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${space.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
