import { ExternalLink, ShieldAlert, Info } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import PageHero from "@/components/common/page-hero"
import Badge from "@/components/ui/badge"
import { sanctionLinksContent } from "@/data/sanctions"
import { getPageContent } from "@/lib/page-content"

export const metadata = {
  title: "Targeted Sanction Lists | MIDAS Stock Broking",
  description:
    "AML/CFT compliance — MIDAS Stock Broking screens all client accounts against UN, APG, and MoHA targeted sanction lists.",
}

export const revalidate = 3600

export default async function SanctionListsPage() {
  const d = await getPageContent("sanctions", sanctionLinksContent)

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle={d.description}
        breadcrumbs={[
          { name: "Compliance" },
          { name: "Sanction Lists" },
        ]}
      >
        <div className="flex lg:justify-end">
          <Badge variant="ghost">
            <ShieldAlert className="h-3.5 w-3.5 text-brand-400" />
            AML / CFT
          </Badge>
        </div>
      </PageHero>

      <SectionWrapper>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {d.lists.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-surface-paper p-7 lg:p-8 rounded-2xl border border-line-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-100 flex flex-col"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 mb-5">
                  <ShieldAlert className="h-5 w-5" />
                </span>

                <div className="text-xs uppercase tracking-wider text-ink-muted mb-2">
                  {item.issuer}
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2.5 leading-snug tracking-tight group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-ink-muted text-[15px] leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                  Open source
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>

          {d.disclaimer && (
            <div className="mt-12 flex items-start gap-3 rounded-2xl border border-line-light bg-surface-alt p-5 lg:p-6 max-w-3xl">
              <Info className="h-5 w-5 mt-0.5 text-ink-muted shrink-0" />
              <p className="text-sm text-ink-muted leading-relaxed">
                {d.disclaimer}
              </p>
            </div>
          )}
        </Container>
      </SectionWrapper>
    </>
  )
}
