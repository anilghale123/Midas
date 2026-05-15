import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers";
import { NO_FLASH_SCRIPT } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MIDAS Stock Broking - Your Trusted Investment Partner",
  description:
    "Professional stock broking services in Nepal. Trade NEPSE shares, demat services, and investment solutions with MIDAS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-text-primary">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
