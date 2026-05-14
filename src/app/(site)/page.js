import HeroSection from "@/components/home/hero-section"
import MarketStatsSection from "@/components/home/market-stats-section"
import AccountTypesSection from "@/components/home/account-types-section"
import WhyTradeSharesSection from "@/components/home/why-trade-shares-section"
import WhyMidasSection from "@/components/home/why-midas-section"
import TradingProcessSection from "@/components/home/trading-process-section"
import LatestNoticesSection from "@/components/home/latest-notices-section"
import NewsletterSection from "@/components/home/newsletter-section"

import {
  heroData,
  marketStatsData,
  accountTypesData,
  whyTradeSharesData,
  whyMidasData,
  tradingProcessData,
  latestNoticesData,
  newsletterData,
} from "@/data/home"

import { getPageContent } from "@/lib/page-content"

export const revalidate = 3600

const FALLBACK = {
  hero: heroData,
  marketStats: marketStatsData,
  accountTypes: accountTypesData,
  whyTradeShares: whyTradeSharesData,
  whyMidas: whyMidasData,
  tradingProcess: tradingProcessData,
  newsletter: newsletterData,
}

export default async function Home() {
  const d = await getPageContent("home", FALLBACK)
  return (
    <div>
      <HeroSection data={d.hero ?? heroData} />
      <MarketStatsSection data={d.marketStats ?? marketStatsData} />
      <AccountTypesSection data={d.accountTypes ?? accountTypesData} />
      <WhyTradeSharesSection data={d.whyTradeShares ?? whyTradeSharesData} />
      <WhyMidasSection data={d.whyMidas ?? whyMidasData} />
      <TradingProcessSection data={d.tradingProcess ?? tradingProcessData} />
      <LatestNoticesSection data={latestNoticesData} />
      <NewsletterSection data={d.newsletter ?? newsletterData} />
    </div>
  )
}
