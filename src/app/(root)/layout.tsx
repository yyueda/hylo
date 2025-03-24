import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
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
  title: "Create Next App",
  description: "Generated by create next app",
};

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
            {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header> */}

            <Topbar />
              <main>
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
