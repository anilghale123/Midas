import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import ServiceCard from "@/components/cards/service-card"

const AccountTypesSection = ({ data }) => {
  return (
    <SectionWrapper>
      <Container>
        <SectionHeading
          eyebrow="Accounts"
          title="Choose the account that fits your journey"
          subtitle="From entry-level NEPSE trading to a premium institutional-grade experience — every account is built on the same foundation of security and trust."
          className="mb-14 lg:mb-16"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
          {data.map((account, index) => (
            <ServiceCard
              key={index}
              title={account.title}
              description={account.description}
              features={account.features}
              buttonText={account.buttonText}
              accent={account.accent}
              badge={account.badge}
              highlighted={account.highlighted}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}

export default AccountTypesSection
