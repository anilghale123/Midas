import { TrendingUp, Users, Shield, DollarSign } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import FeatureCard from "@/components/cards/feature-card"

const icons = [TrendingUp, Users, Shield, DollarSign]
const tones = ["success", "primary", "gold", "success"]

const WhyTradeSharesSection = ({ data }) => {
  return (
    <SectionWrapper tone="alt">
      <Container>
        <SectionHeading
          eyebrow="Why invest"
          title="Why trade shares"
          subtitle="Investing in equities is one of the most reliable ways to compound your wealth. Here's why thousands of Nepali investors trust the market."
          className="mb-14 lg:mb-16"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {data.map((item, index) => {
            const Icon = icons[index] ?? TrendingUp
            return (
              <FeatureCard
                key={index}
                title={item.title}
                description={item.description}
                iconTone={tones[index] ?? "primary"}
                icon={<Icon className="h-5 w-5" strokeWidth={2.25} />}
              />
            )
          })}
        </div>
      </Container>
    </SectionWrapper>
  )
}

export default WhyTradeSharesSection
