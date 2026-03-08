import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cookies } from "next/headers";
import ChatbotWrapper from "@/components/chatbot/ChatbotWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandFill Pro",
  description: "Comprehensive Landfill Management & Reporting Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const colorModeCookie = cookieStore.get("chakra-ui-color-mode")?.value;
  const cookieString = colorModeCookie
    ? `chakra-ui-color-mode=${colorModeCookie}`
    : undefined;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers cookies={cookieString}>
          {children}
          <ChatbotWrapper />
        </Providers>
      </body>
    </html>
  );
}