import HeroSection from "@/components/home/hero-section"
import MarketStatsSection from "@/components/home/market-stats-section"
import AccountTypesSection from "@/components/home/account-types-section"
import WhyTradeSharesSection from "@/components/home/why-trade-shares-section"
import WhyMidasSection from "@/components/home/why-midas-section"
import TradingProcessSection from "@/components/home/trading-process-section"
import LatestNoticesSection from "@/components/home/latest-notices-section"
import NewsletterSection from "@/components/home/newsletter-section"
import AnimateOnScroll from "@/components/ui/animate-on-scroll"

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
      {/* Hero animates immediately on mount via PageTransition */}
      <HeroSection data={d.hero ?? heroData} />

      <AnimateOnScroll animation="fade-up">
        <MarketStatsSection data={d.marketStats ?? marketStatsData} />
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up">
        <AccountTypesSection data={d.accountTypes ?? accountTypesData} />
      </AnimateOnScroll>

      <AnimateOnScroll animation="slide-in-left">
        <WhyTradeSharesSection data={d.whyTradeShares ?? whyTradeSharesData} />
      </AnimateOnScroll>

      <AnimateOnScroll animation="slide-in-right">
        <WhyMidasSection data={d.whyMidas ?? whyMidasData} />
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up">
        <TradingProcessSection data={d.tradingProcess ?? tradingProcessData} />
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up">
        <LatestNoticesSection data={latestNoticesData} />
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up">
        <NewsletterSection data={d.newsletter ?? newsletterData} />
      </AnimateOnScroll>
    </div>
  )
}
