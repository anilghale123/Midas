import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { navigationData, authLinks } from "@/data/navigation";
import { footerData } from "@/data/footer";
import { getPageContent } from "@/lib/page-content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MIDAS Stock Broking - Your Trusted Investment Partner",
  description: "Professional stock broking services in Nepal. Trade NEPSE shares, demat services, and investment solutions with MIDAS.",
};

const HEADER_FALLBACK = { navigation: navigationData, authLinks };
const FOOTER_FALLBACK = {
  companyBio: footerData.companyBio,
  columns: Object.entries(footerData.columns ?? {}).map(([title, links]) => ({
    title,
    links,
  })),
  regulatoryLinks: footerData.regulatoryLinks,
  socialLinks: footerData.socialLinks,
  grievanceOfficer: footerData.grievanceOfficer,
  brokerNumber: footerData.brokerNumber,
  regulator: footerData.regulator,
};

export default async function RootLayout({ children }) {
  const headerContent = await getPageContent("header", HEADER_FALLBACK);
  const footerContent = await getPageContent("footer", FOOTER_FALLBACK);

  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="min-h-screen flex flex-col">
        <Header navigation={headerContent.navigation} authLinks={headerContent.authLinks} />
        <main className="flex-1">{children}</main>
        <Footer data={footerContent} />
      </body>
    </html>
  );
}
