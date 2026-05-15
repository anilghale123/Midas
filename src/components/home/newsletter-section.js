import { Mail, ArrowRight } from "lucide-react"
import Container from "@/components/ui/container"
import SectionWrapper from "@/components/ui/section-wrapper"

const NewsletterSection = ({ data }) => {
  return (
    <SectionWrapper tone="alt">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-primary-700 text-white px-6 sm:px-10 lg:px-14 py-14 lg:py-16 shadow-lg">
          {/* decorative gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl"
          />

          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/85 backdrop-blur">
                <Mail className="h-3.5 w-3.5 text-brand-400" />
                Weekly market digest
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-balance text-brand-400">
                {data.title}
              </h2>
              <p className="mt-3.5 text-white/70 text-base lg:text-lg leading-relaxed max-w-xl">
                {data.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <form className="flex flex-col sm:flex-row gap-3 bg-white/6 border border-white/10 rounded-xl p-1.5 backdrop-blur">
                <input
                  type="email"
                  placeholder={data.placeholder}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-400 text-white px-5 py-3 text-sm font-semibold shadow-md hover:bg-brand-400 transition-colors"
                >
                  {data.buttonText}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              {data.microcopy && (
                <p className="mt-3 text-xs text-white/50">{data.microcopy}</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}

export default NewsletterSection
