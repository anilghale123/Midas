import { Award, Building2, Headphones } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import StatsCard from "@/components/cards/stats-card"

const iconForIndex = [Award, Building2, Headphones]

const MarketStatsSection = ({ data }) => {
  return (
    <SectionWrapper tone="alt">
      <Container>
        <SectionHeading
          eyebrow="By the numbers"
          title="A broker built on institutional trust"
          subtitle="The metrics that matter — regulatory credentials, market access, and the service standards we hold ourselves to."
          className="mb-14 lg:mb-16"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {data.map((stat, index) => {
            const Icon = iconForIndex[index] ?? Award
            return (
              <StatsCard
                key={index}
                value={stat.value}
                label={stat.label}
                description={stat.description}
                icon={<Icon className="h-5 w-5" />}
              />
            )
          })}
        </div>
      </Container>
    </SectionWrapper>
  )
}

export default MarketStatsSection
