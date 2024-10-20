// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import "intro.js/introjs.css";
import Web3Providers from "./Web3Providers";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
export const metadata: Metadata = {
  title: "Developer Sandbox",
  description: "A developer sandbox for building on Story.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Providers><Navbar />{children}<Footer /></Web3Providers>
      </body> 
    </html>
  );
}
