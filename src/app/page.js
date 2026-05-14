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

export default function Home() {
  return (
    <div>
      <HeroSection data={heroData} />
      <MarketStatsSection data={marketStatsData} />
      <AccountTypesSection data={accountTypesData} />
      <WhyTradeSharesSection data={whyTradeSharesData} />
      <WhyMidasSection data={whyMidasData} />
      <TradingProcessSection data={tradingProcessData} />
      <LatestNoticesSection data={latestNoticesData} />
      <NewsletterSection data={newsletterData} />
    </div>
  )
}
