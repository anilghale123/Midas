import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import Container from "@/components/ui/container"
import { cn } from "@/lib/utils"

/**
 * Compact navy hero used at the top of inner pages.
 *
 * Props
 *  - eyebrow, title, subtitle: text content
 *  - breadcrumbs: [{ name, href? }]  // last item without href = current page
 *  - children: optional right-side content (e.g. quick-fact badges)
 */
const PageHero = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  children,
  className,
}) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-hero-gradient text-white",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.85), transparent 75%)",
        }}
      />

      <Container className="relative py-14 sm:py-18 lg:py-24">
        {breadcrumbs?.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs text-white/60"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
            {breadcrumbs.map((b, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-white/30" />
                  {isLast || !b.href ? (
                    <span className="text-white/90">{b.name}</span>
                  ) : (
                    <Link
                      href={b.href}
                      className="hover:text-white transition-colors"
                    >
                      {b.name}
                    </Link>
                  )}
                </span>
              )
            })}
          </nav>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            {eyebrow && (
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-balance text-brand-400">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-2xl text-base lg:text-lg text-white/70 leading-relaxed text-pretty">
                {subtitle}
              </p>
            )}
          </div>

          {children && <div className="lg:col-span-4">{children}</div>}
        </div>
      </Container>
    </section>
  )
}

export default PageHero
