import { MapPin, Mail, Phone, Clock, UserCheck } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import PageHero from "@/components/common/page-hero"
import Badge from "@/components/ui/badge"
import { contactContent } from "@/data/contact"
import { getPageContent } from "@/lib/page-content"

export const metadata = {
  title: "Contact Us | MIDAS Stock Broking",
  description:
    "Get in touch with MIDAS Stock Broking. Visit our Kathmandu head office or Butwal branch, or reach our Grievance Officer directly.",
}

export const revalidate = 3600

export default async function ContactPage() {
  const d = await getPageContent("contact", contactContent)

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle={d.subtitle}
        breadcrumbs={[{ name: "Contact Us" }]}
      >
        <div className="flex flex-wrap gap-2.5 lg:justify-end">
          <Badge variant="ghost">
            <Clock className="h-3.5 w-3.5" />
            {d.hours.value}
          </Badge>
        </div>
      </PageHero>

      {/* Offices */}
      <SectionWrapper>
        <Container>
          <SectionHeading
            eyebrow="Our offices"
            title="Visit us in person"
            subtitle="Two physical locations across Nepal — Kathmandu and Butwal — staffed by client advisors during all business hours."
            className="mb-14 lg:mb-16"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {d.locations.map((loc, i) => (
              <div
                key={loc.type}
                className="relative bg-surface-paper p-8 rounded-2xl border border-line-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-ink tracking-tight">
                      {loc.type}
                    </h3>
                    <p className="text-sm text-ink-muted">{loc.address}</p>
                  </div>
                </div>

                <dl className="space-y-4 mt-6 border-t border-line-light pt-5">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink-muted mb-2">
                      Phone
                    </dt>
                    <dd className="flex flex-col gap-1.5">
                      {loc.phones.map((p) => (
                        <a
                          key={p}
                          href={`tel:${p.replace(/[^+\d]/g, "")}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary-600 transition-colors w-fit"
                        >
                          <Phone className="h-4 w-4 text-primary-600" />
                          {p}
                        </a>
                      ))}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-wider text-ink-muted mb-2">
                      Email
                    </dt>
                    <dd className="flex flex-col gap-1.5">
                      {loc.emails.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary-600 transition-colors w-fit break-all"
                        >
                          <Mail className="h-4 w-4 text-primary-600 shrink-0" />
                          {e}
                        </a>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      {/* Grievance officer */}
      <SectionWrapper tone="alt">
        <Container>
          <div className="rounded-2xl border border-brand-200 bg-surface-paper shadow-card overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-5 p-8 lg:p-10 bg-linear-to-br from-brand-50 to-surface-paper border-b lg:border-b-0 lg:border-r border-brand-100">
                <Badge variant="gold">Compliance</Badge>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Grievance Officer
                </h2>
                <p className="mt-3 text-ink-muted leading-relaxed text-[15px]">
                  {d.grievanceOfficer.description}
                </p>
              </div>

              <div className="lg:col-span-7 p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-md ring-4 ring-primary-50">
                    <UserCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-ink-muted">
                      {d.grievanceOfficer.role}
                    </div>
                    <div className="text-xl font-bold text-ink tracking-tight">
                      {d.grievanceOfficer.name}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  <a
                    href={`tel:${d.grievanceOfficer.phone}`}
                    className="flex items-center gap-3 rounded-xl border border-line-light bg-surface-alt px-4 py-3.5 hover:bg-surface-paper hover:border-primary-100 transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100 shrink-0">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs text-ink-muted">Phone</div>
                      <div className="text-sm font-semibold text-ink truncate">
                        {d.grievanceOfficer.phone}
                      </div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${d.grievanceOfficer.email}`}
                    className="flex items-center gap-3 rounded-xl border border-line-light bg-surface-alt px-4 py-3.5 hover:bg-surface-paper hover:border-primary-100 transition-colors"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100 shrink-0">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs text-ink-muted">Email</div>
                      <div className="text-sm font-semibold text-ink truncate">
                        {d.grievanceOfficer.email}
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
