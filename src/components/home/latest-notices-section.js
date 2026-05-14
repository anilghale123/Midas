import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"
import SectionHeading from "@/components/ui/section-heading"
import NewsCard from "@/components/cards/news-card"

const LatestNoticesSection = ({ data }) => {
  return (
    <SectionWrapper>
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 lg:mb-14">
          <SectionHeading
            eyebrow="Notices & news"
            title="Latest from the market"
            subtitle="AGMs, dividends, holidays, and other regulatory announcements — straight from the source."
            align="left"
            className="mx-0"
          />
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors self-start md:self-end"
          >
            View all notices
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {data.map((notice) => (
            <NewsCard
              key={notice.id}
              id={notice.id}
              title={notice.title}
              date={notice.date}
              category={notice.category}
              excerpt={notice.excerpt}
            />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}

export default LatestNoticesSection
