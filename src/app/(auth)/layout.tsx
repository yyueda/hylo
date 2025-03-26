import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";
import { Metadata } from "next";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A NextJS Threads Application'
}

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark
            }}
        >
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
