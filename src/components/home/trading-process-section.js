import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import CTAButton from "@/components/ui/cta-button"

const TradingProcessSection = ({ data }) => {
  return (
    <SectionWrapper tone="alt">
      <Container>
        <SectionHeading
          eyebrow="Get started"
          title="Start trading in three simple steps"
          subtitle="Onboarding is fast, fully guided, and built around compliance — so you can focus on what matters: investing."
          className="mb-14 lg:mb-16"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* connector line on desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-9 mx-[16%] h-px bg-linear-to-r from-transparent via-primary-200 to-transparent"
          />

          {data.map((step, index) => (
            <div
              key={index}
              className="relative bg-surface-paper p-8 rounded-2xl border border-line-light shadow-card text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-white text-lg font-bold shadow-md ring-4 ring-surface-paper">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2.5 tracking-tight">
                {step.title}
              </h3>
              <p className="text-ink-muted leading-relaxed text-[15px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton variant="primary" size="lg" href="/register">
            Open my account
          </CTAButton>
        </div>
      </Container>
    </SectionWrapper>
  )
}

export default TradingProcessSection
