import { Award, CheckCircle, Cpu, Headphones } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import FeatureCard from "@/components/cards/feature-card"

const icons = [Award, CheckCircle, Cpu, Headphones]
const tones = ["gold", "primary", "success", "primary"]

const WhyMidasSection = ({ data }) => {
  return (
    <SectionWrapper>
      <Container>
        <SectionHeading
          eyebrow="Why MIDAS"
          title="A partner you can rely on"
          subtitle="Trust isn't claimed — it's earned. Here's what 15+ years in Nepal's financial markets has taught us, and what you get when you trade with MIDAS."
          className="mb-14 lg:mb-16"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {data.map((item, index) => {
            const Icon = icons[index] ?? Award
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

export default WhyMidasSection
