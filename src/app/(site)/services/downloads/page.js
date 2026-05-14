import Link from "next/link"
import { Download, FileText } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import Badge from "@/components/ui/badge"
import PageHero from "@/components/common/page-hero"
import { downloadsContent } from "@/data/services"
import { getPageContent } from "@/lib/page-content"

export const metadata = {
  title: "Downloads | MIDAS Stock Broking",
  description:
    "Download the KYC form, DEMAT account opening form, DIS, and other documents required to start trading with MIDAS.",
}

export const revalidate = 3600

export default async function DownloadsPage() {
  const d = await getPageContent("downloads", downloadsContent)

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle={d.subtitle}
        breadcrumbs={[
          { name: "Services", href: "/services" },
          { name: "Downloads" },
        ]}
      />

      <SectionWrapper>
        <Container>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
            {d.files.map((file) => (
              <li key={file.title}>
                <Link
                  href={file.href}
                  className="group flex items-start gap-5 bg-surface-paper p-6 lg:p-7 rounded-2xl border border-line-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-100"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                    <FileText className="h-5 w-5" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="primary">{file.type}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-ink tracking-tight mb-1.5 group-hover:text-primary-600 transition-colors">
                      {file.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {file.description}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className="self-center inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-ink-secondary group-hover:bg-primary-500 group-hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </SectionWrapper>
    </>
  )
}
