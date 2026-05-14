import { ArrowRight, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import Badge from "@/components/ui/badge"
import PageHero from "@/components/common/page-hero"
import { cn } from "@/lib/utils"
import { servicesContent } from "@/data/services"
import { connectDB } from "@/lib/mongodb"
import Service from "@/models/Service"

export const metadata = {
  title: "Our Services | MIDAS Stock Broking",
  description:
    "Trade NEPSE shares online, manage your MIDAS back-office account, and access DEMAT custody — all from a single regulated broker.",
}

export const revalidate = 3600

const ACCENT_BY_CATEGORY = {
  Trading: "nepse",
  Advisory: "midas",
  DEMAT: "demat",
  IPO: "nepse",
  Other: "nepse",
}

const getActiveServices = unstable_cache(
  async () => {
    if (!process.env.MONGODB_URI) return []
    try {
      await connectDB()
      const docs = await Service.find({ isActive: true })
        .sort({ order: 1, createdAt: 1 })
        .lean()
      return docs.map((s) => ({
        id: String(s._id),
        title: s.title,
        type: s.category ?? "Service",
        accent: ACCENT_BY_CATEGORY[s.category] ?? "nepse",
        description: s.shortDescription || s.description || "",
        href: s.ctaHref || "#",
        actionText: s.ctaLabel || "Learn more",
        external: typeof s.ctaHref === "string" && /^https?:\/\//.test(s.ctaHref),
      }))
    } catch {
      return []
    }
  },
  ["public-services"],
  { tags: ["services"], revalidate: 3600 }
)

const accentMap = {
  nepse: { dot: "bg-portal-nepse", ring: "ring-primary-100" },
  midas: { dot: "bg-portal-midas", ring: "ring-brand-100"   },
  demat: { dot: "bg-portal-demat", ring: "ring-success-100" },
}

const accentBadge = {
  nepse: "primary",
  midas: "gold",
  demat: "success",
}

export default async function ServicesPage() {
  const dbServices = await getActiveServices()
  const servicesList = dbServices.length > 0 ? dbServices : servicesContent.servicesList
  const d = { ...servicesContent, servicesList }
  const { brokerageCommission, dematFees } = d.serviceCharges

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle={d.subtitle}
        breadcrumbs={[{ name: "Services" }]}
      />

      {/* Services list */}
      <SectionWrapper>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
            {d.servicesList.map((s) => {
              const accent = accentMap[s.accent] ?? accentMap.nepse
              return (
                <article
                  key={s.id}
                  id={s.id}
                  className={cn(
                    "group relative bg-surface-paper p-8 rounded-2xl border border-line-light",
                    "shadow-card transition-all duration-300 flex flex-col",
                    "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-100"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn("h-2.5 w-2.5 rounded-full", accent.dot)} />
                    <Badge variant={accentBadge[s.accent] ?? "default"}>{s.type}</Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-ink mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-ink-muted leading-relaxed mb-8 flex-1">
                    {s.description}
                  </p>

                  <Link
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-between gap-2 rounded-xl bg-primary-500 text-white px-5 py-3 text-sm font-semibold shadow-md transition-all hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {s.actionText}
                    {s.external ? (
                      <ExternalLink className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Link>
                </article>
              )
            })}
          </div>
        </Container>
      </SectionWrapper>

      {/* Charges */}
      <SectionWrapper tone="alt">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Service charges"
            subtitle="Transparent, regulator-aligned fees. No hidden costs."
            className="mb-14 lg:mb-16"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {/* Brokerage tiers */}
            <div className="rounded-2xl border border-line-light bg-surface-paper shadow-card overflow-hidden">
              <div className="px-6 lg:px-8 py-5 border-b border-line-light bg-surface-alt/50">
                <h3 className="text-lg font-semibold text-ink tracking-tight">
                  {brokerageCommission.title}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-ink-muted bg-surface-alt/40">
                      {brokerageCommission.headers.map((h) => (
                        <th key={h} className="px-6 lg:px-8 py-3.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-light">
                    {brokerageCommission.tiers.map((t) => (
                      <tr key={t.volume} className="hover:bg-surface-alt/40 transition-colors">
                        <td className="px-6 lg:px-8 py-4 text-ink-secondary">{t.volume}</td>
                        <td className="px-6 lg:px-8 py-4 font-semibold text-primary-600 tabular-nums">
                          {t.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 lg:px-8 py-4 flex items-start gap-2.5 border-t border-line-light bg-brand-50/40 text-xs text-ink-secondary">
                <Info className="h-4 w-4 mt-0.5 text-brand-700 shrink-0" />
                <span>{brokerageCommission.note}</span>
              </div>
            </div>

            {/* Demat fees */}
            <div className="rounded-2xl border border-line-light bg-surface-paper shadow-card overflow-hidden">
              <div className="px-6 lg:px-8 py-5 border-b border-line-light bg-surface-alt/50">
                <h3 className="text-lg font-semibold text-ink tracking-tight">
                  {dematFees.title}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-ink-muted bg-surface-alt/40">
                      {dematFees.headers.map((h) => (
                        <th key={h} className="px-6 lg:px-8 py-3.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-light">
                    {dematFees.rows.map((r) => (
                      <tr key={r.type} className="hover:bg-surface-alt/40 transition-colors">
                        <td className="px-6 lg:px-8 py-4 text-ink-secondary">{r.type}</td>
                        <td className="px-6 lg:px-8 py-4 font-semibold text-primary-600 tabular-nums">
                          {r.charge}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 lg:px-8 py-4 flex items-start gap-2.5 border-t border-line-light bg-success-50/40 text-xs text-ink-secondary">
                <Info className="h-4 w-4 mt-0.5 text-success-700 shrink-0" />
                <span>{dematFees.note}</span>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
