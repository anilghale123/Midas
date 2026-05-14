import { cn } from "@/lib/utils"

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  inverse = false,
  className,
  ...props
}) => {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto"

  return (
    <div className={cn("max-w-3xl", alignment, className)} {...props}>
      {eyebrow && (
        <span
          className={cn(
            "inline-block text-xs font-semibold uppercase tracking-[0.18em] mb-4",
            inverse ? "text-brand-400" : "text-brand-600"
          )}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h2
          className={cn(
            "text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight text-balance",
            inverse ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base sm:text-lg leading-relaxed text-pretty",
            inverse ? "text-white/70" : "text-ink-muted"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
