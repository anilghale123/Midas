import { ShieldCheck, Headphones, Cpu, MapPin, Award } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import Badge from "@/components/ui/badge"
import FeatureCard from "@/components/cards/feature-card"
import PageHero from "@/components/common/page-hero"
import CTAButton from "@/components/ui/cta-button"
import { aboutContent } from "@/data/about"
import { getPageContent } from "@/lib/page-content"

export const metadata = {
  title: "About Us | MIDAS Stock Broking",
  description:
    "MIDAS Stock Broking — the 21st broker member of the Nepal Stock Exchange, regulated by SEBON. Learn about our mission, values, and reach.",
}

export const revalidate = 3600

const valueIcons = {
  ShieldCheck,
  Headphones,
  Cpu,
}

const valueTones = ["primary", "success", "gold"]

export default async function AboutPage() {
  const d = await getPageContent("about", aboutContent)

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle="A SEBON-licensed brokerage firm — and the 21st broker member of NEPSE — committed to bridging investors and listed companies in Nepal."
        breadcrumbs={[{ name: "About Us" }]}
      >
        <div className="flex flex-wrap gap-2.5 lg:justify-end">
          <Badge variant="gold">Broker #{d.brokerNumber}</Badge>
          <Badge variant="ghost">{d.regulatoryBody}</Badge>
          <Badge variant="ghost">NEPSE Member</Badge>
        </div>
      </PageHero>

      {/* Introduction */}
      <SectionWrapper>
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Who we are"
                title="Built on regulation, run on trust."
                align="left"
                className="mx-0"
              />
            </div>

            <div className="lg:col-span-7 space-y-6 text-ink-secondary leading-relaxed text-[17px]">
              <p>{d.introduction}</p>
              <p>{d.mission}</p>

              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-line-light bg-surface-alt p-5 lg:p-6">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink mb-1">
                    Remote Work Station — Butwal
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {d.accessibility}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Core values */}
      <SectionWrapper tone="alt">
        <Container>
          <SectionHeading
            eyebrow="Core values"
            title="The principles we trade on."
            subtitle="Three values that shape every decision — from how we onboard a new client to how we execute a trade."
            className="mb-14 lg:mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {d.coreValues.map((value, i) => {
              const Icon = valueIcons[value.iconName] ?? Award
              return (
                <FeatureCard
                  key={value.title}
                  title={value.title}
                  description={value.description}
                  iconTone={valueTones[i] ?? "primary"}
                  icon={<Icon className="h-5 w-5" strokeWidth={2.25} />}
                />
              )
            })}
          </div>
        </Container>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper>
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-primary-700 text-white px-6 sm:px-10 lg:px-14 py-14 lg:py-16 text-center shadow-lg">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
            />
            <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Ready to invest with a regulated broker?
            </h2>
            <p className="relative mt-4 max-w-xl mx-auto text-white/70 text-base lg:text-lg leading-relaxed">
              Open an account in minutes — KYC is free, and our advisors will guide you every step of the way.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <CTAButton variant="gold" size="lg" href="/services/downloads">
                Open an Account
              </CTAButton>
              <CTAButton variant="outline" size="lg" href="/contact">
                Talk to us
              </CTAButton>
            </div>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
