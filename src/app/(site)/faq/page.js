import Link from "next/link"
import { MessageCircle, Phone, ArrowRight } from "lucide-react"
import { unstable_cache } from "next/cache"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import PageHero from "@/components/common/page-hero"
import FaqAccordion from "@/components/common/faq-accordion"
import { faqContent } from "@/data/faq"
import { connectDB } from "@/lib/mongodb"
import FAQ from "@/models/FAQ"

export const metadata = {
  title: "FAQ | MIDAS Stock Broking",
  description:
    "Common questions about opening an account, DEMAT services, T+2 settlement, and the difference between the MIDAS Account and NEPSE Online Account.",
}

export const revalidate = 3600

const getActiveFaqs = unstable_cache(
  async () => {
    if (!process.env.MONGODB_URI) return []
    try {
      await connectDB()
      const docs = await FAQ.find({ isActive: true })
        .sort({ order: 1, createdAt: 1 })
        .lean()
      return docs.map((f) => ({
        id: String(f._id),
        question: f.question,
        answer: f.answer,
      }))
    } catch {
      return []
    }
  },
  ["public-faqs"],
  { tags: ["faqs"], revalidate: 3600 }
)

export default async function FaqPage() {
  const dbItems = await getActiveFaqs()
  const items = dbItems.length > 0 ? dbItems : faqContent.items
  const d = { ...faqContent, items }

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        subtitle={d.subtitle}
        breadcrumbs={[{ name: "FAQ" }]}
      />

      <SectionWrapper>
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Accordion */}
            <div className="lg:col-span-8">
              <FaqAccordion items={d.items} />
            </div>

            {/* Side help card */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-line-light bg-surface-paper p-7 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 mb-4">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-ink tracking-tight mb-2">
                  Still have questions?
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  Our advisors are available every business day, Sunday through Friday. Reach out and we'll get back to you quickly.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="flex items-center justify-between gap-2 rounded-xl bg-primary-500 text-white px-4 py-3 text-sm font-semibold shadow-md hover:bg-primary-600 transition-colors"
                  >
                    Contact our team
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="tel:+97715970056"
                    className="flex items-center justify-between gap-2 rounded-xl border border-line-light bg-surface-alt text-ink px-4 py-3 text-sm font-semibold hover:bg-surface-paper hover:border-primary-100 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary-600" />
                      01-5970056
                    </span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
