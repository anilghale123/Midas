import { cn } from "@/lib/utils"

const variants = {
  default: "bg-line-light text-ink-secondary",
  primary: "bg-primary-50 text-primary-700 border border-primary-100",
  success: "bg-success-50 text-success-700 border border-success-100",
  gold:    "bg-brand-50 text-brand-700 border border-brand-100",
  solid:   "bg-primary-500 text-white",
  ghost:   "bg-white/10 text-white border border-white/15 backdrop-blur",
}

const Badge = ({ children, variant = "default", className, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
