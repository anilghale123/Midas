import Link from "next/link"
import { cn } from "@/lib/utils"

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold " +
  "transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "active:translate-y-0"

const variants = {
  primary:
    "bg-primary-500 text-white shadow-md " +
    "hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-lg",
  secondary:
    "border border-primary-500 text-primary-500 bg-transparent " +
    "hover:bg-primary-500 hover:text-white",
  gold:
    "bg-orange-400 text-white shadow-md " +
    "hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-lg",
  success:
    "bg-success-500 text-white shadow-md " +
    "hover:bg-success-600 hover:-translate-y-0.5 hover:shadow-lg",
  ghost:
    "text-primary-500 hover:bg-primary-50",
  outline:
    "border border-white/40 text-white bg-white/0 " +
    "hover:bg-white hover:text-primary-700",
}

const sizes = {
  sm: "px-4 py-2 text-xs rounded-lg",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
}

const CTAButton = ({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  ...props
}) => {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default CTAButton
