import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import CTAButton from "@/components/ui/cta-button"
import Badge from "@/components/ui/badge"

const accents = {
  nepse:  { dot: "bg-portal-nepse", badge: "primary",  ring: "ring-primary-100"  },
  midas:  { dot: "bg-portal-midas", badge: "gold",     ring: "ring-brand-100"    },
  demat:  { dot: "bg-portal-demat", badge: "success",  ring: "ring-success-100"  },
}

const ServiceCard = ({
  title,
  description,
  features,
  buttonText,
  accent = "nepse",
  highlighted = false,
  badge,
  className,
  ...props
}) => {
  const a = accents[accent] ?? accents.nepse

  return (
    <article
      className={cn(
        "group relative bg-surface-paper p-8 rounded-2xl border shadow-card",
        "flex flex-col h-full transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover",
        highlighted
          ? "border-brand-200 ring-1 ring-brand-100"
          : "border-line-light hover:border-primary-100",
        className
      )}
      {...props}
    >
      {highlighted && (
        <div className="absolute -top-3 left-8">
          <Badge variant="gold">Most Popular</Badge>
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", a.dot)} aria-hidden />
        {badge && <Badge variant={a.badge}>{badge}</Badge>}
      </div>

      <h3 className="text-2xl font-bold text-ink mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-ink-muted leading-relaxed mb-6">
        {description}
      </p>

      {features && (
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink-secondary">
              <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success-50 text-success-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <CTAButton
          variant={highlighted ? "gold" : "primary"}
          className="w-full"
        >
          {buttonText}
        </CTAButton>
      </div>
    </article>
  )
}

export default ServiceCard
