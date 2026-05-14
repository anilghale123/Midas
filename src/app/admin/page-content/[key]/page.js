import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import PageContent, { PAGE_CONTENT_KEYS } from "@/models/PageContent";
import { PAGE_CONTENT_LABELS } from "@/lib/validations/page-content.schema";

import HomeContentForm from "@/components/admin/page-content/home-form";
import AboutContentForm from "@/components/admin/page-content/about-form";
import HeaderContentForm from "@/components/admin/page-content/header-form";
import FooterContentForm from "@/components/admin/page-content/footer-form";
import ContactContentForm from "@/components/admin/page-content/contact-form";
import SanctionsContentForm from "@/components/admin/page-content/sanctions-form";
import DownloadsContentForm from "@/components/admin/page-content/downloads-form";

import { heroData, marketStatsData, accountTypesData, whyTradeSharesData, whyMidasData, tradingProcessData, newsletterData } from "@/data/home";
import { aboutContent } from "@/data/about";
import { navigationData, authLinks } from "@/data/navigation";
import { footerData } from "@/data/footer";
import { contactContent } from "@/data/contact";
import { sanctionLinksContent } from "@/data/sanctions";
import { downloadsContent } from "@/data/services";

export const dynamic = "force-dynamic";

const FORMS = {
  home: HomeContentForm,
  about: AboutContentForm,
  header: HeaderContentForm,
  footer: FooterContentForm,
  contact: ContactContentForm,
  sanctions: SanctionsContentForm,
  downloads: DownloadsContentForm,
};

const FALLBACKS = {
  home: {
    hero: heroData,
    marketStats: marketStatsData,
    accountTypes: accountTypesData,
    whyTradeShares: whyTradeSharesData,
    whyMidas: whyMidasData,
    tradingProcess: tradingProcessData,
    newsletter: newsletterData,
  },
  about: aboutContent,
  header: {
    navigation: navigationData,
    authLinks: authLinks,
  },
  footer: {
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
  },
  contact: contactContent,
  sanctions: sanctionLinksContent,
  downloads: downloadsContent,
};

export default async function PageContentEditor({ params }) {
  const { key } = await params;
  if (!PAGE_CONTENT_KEYS.includes(key)) notFound();

  const FormComponent = FORMS[key];
  if (!FormComponent) notFound();

  await connectDB();
  const doc = await PageContent.findOne({ key }).lean();
  const initial = doc?.data ?? FALLBACKS[key];
  const fallback = FALLBACKS[key];

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/page-content" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to site content
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {PAGE_CONTENT_LABELS[key]}
      </h1>
      {!doc && (
        <p className="mt-1 text-xs text-amber-700">
          Currently using fallback content from <code>src/data/</code>. Save once to start storing edits in the database.
        </p>
      )}

      <div className="mt-6">
        <FormComponent
          initial={JSON.parse(JSON.stringify(initial))}
          fallback={JSON.parse(JSON.stringify(fallback))}
        />
      </div>
    </div>
  );
}
