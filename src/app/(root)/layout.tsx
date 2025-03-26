import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Topbar from "../../../components/shared/Topbar";
import LeftSidebar from "../../../components/shared/LeftSidebar";
import RightSidebar from "../../../components/shared/RightSidebar";
import Bottombar from "../../../components/shared/Bottombar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A NextJS Threads Application'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Topbar />
              <main className="flex">
                <LeftSidebar />
                  <section className="main-container">
                    <div className="w-full max-w-4xl">
                      {children}
                    </div>
                  </section>
                <RightSidebar />
              </main>
            <Bottombar />
          </body>
        </html>
      </ClerkProvider>
  );
}
