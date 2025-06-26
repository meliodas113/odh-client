import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { Web3Provider } from "@/Provider/Web3provider";

import { Alata } from "next/font/google";

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "OddsHub",
  description: "Your gateway to the future of prediction markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>OddsHub</title>
        <meta
          name="OddsHub | Your gateway to the future of prediction markets"
          content="Your gateway to the future of prediction markets"
        />
        <link rel="icon" href="/assets/logos/oddshub.svg" />
      </head>
      <body className={alata.className}>
        <NextTopLoader showSpinner={false} color="#2043cf" />
        <Web3Provider>
          <main
            style={{
              flex: "1",
              width: "100%",
              height: "100%",
            }}
          >
            {children}
          </main>
        </Web3Provider>
        <Toaster />
      </body>
    </html>
  );
}
