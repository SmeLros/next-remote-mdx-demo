import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DocsAside } from "@/components/docs/Aside";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-screen h-screen flex">
          <DocsAside />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
