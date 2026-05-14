import { ArrowRight, ArrowUpRight, ArrowDownRight, ShieldCheck } from "lucide-react"
import Container from "@/components/ui/container"
import CTAButton from "@/components/ui/cta-button"
import Badge from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const HeroSection = ({ data }) => {
  const d = data.dashboard

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.85), transparent 75%)",
        }}
      />

      <Container className="relative py-20 lg:py-28 xl:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* LEFT — copy */}
          <div className="lg:col-span-7 animate-fade-up">
            {data.eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/85 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
                {data.eyebrow}
              </span>
            )}

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance text-orange-400">
              {data.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/75 leading-relaxed text-pretty">
              {data.subtitle}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
              <CTAButton variant="gold" size="lg" href={data.primaryButton.href}>
                {data.primaryButton.text}
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <CTAButton variant="outline" size="lg" href={data.secondaryButton.href}>
                {data.secondaryButton.text}
              </CTAButton>
            </div>

            {data.trustBadges?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2.5">
                {data.trustBadges.map((b) => (
                  <Badge key={b.label} variant="ghost">{b.label}</Badge>
                ))}
              </div>
            )}

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg border-t border-white/10 pt-8">
              {data.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl lg:text-3xl font-bold tracking-tight">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/55">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — dashboard preview */}
          <div className="lg:col-span-5 animate-fade-up delay-200">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-brand-500/15 via-transparent to-success-500/10 blur-2xl"
              />

              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-white/45">
                    Live · NEPSE
                  </span>
                </div>

                {/* Index summary */}
                <div className="px-6 pt-6 pb-2">
                  <div className="text-xs uppercase tracking-wider text-white/50">
                    {d.indexLabel}
                  </div>
                  <div className="mt-1.5 flex items-end gap-3">
                    <div className="text-3xl lg:text-4xl font-bold tracking-tight">
                      {d.indexValue}
                    </div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 text-sm font-semibold pb-1",
                        d.isPositive ? "text-success-400" : "text-status-error"
                      )}
                    >
                      {d.isPositive ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {d.indexChange} ({d.indexPercent})
                    </div>
                  </div>

                  {/* Sparkline */}
                  <svg
                    className="mt-4 w-full"
                    viewBox="0 0 320 70"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,52 L25,46 L50,50 L80,38 L110,42 L140,30 L170,34 L200,22 L235,28 L265,16 L295,20 L320,10 L320,70 L0,70 Z"
                      fill="url(#spark)"
                    />
                    <path
                      d="M0,52 L25,46 L50,50 L80,38 L110,42 L140,30 L170,34 L200,22 L235,28 L265,16 L295,20 L320,10"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Tickers */}
                <div className="px-3 pb-3">
                  <ul className="divide-y divide-white/5">
                    {d.tickers.map((t) => (
                      <li
                        key={t.symbol}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-white">{t.symbol}</div>
                          <div className="text-xs text-white/45 truncate">{t.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white tabular-nums">{t.price}</div>
                          <div
                            className={cn(
                              "text-xs font-medium tabular-nums",
                              t.up ? "text-success-400" : "text-status-error"
                            )}
                          >
                            {t.change}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Floating premium card */}
              <div className="hidden md:flex absolute -bottom-5 -left-5 items-center gap-3 rounded-xl bg-white text-ink shadow-lg px-4 py-3 border border-line-light">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-muted">Regulated</div>
                  <div className="text-sm font-semibold">SEBON Licensed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
