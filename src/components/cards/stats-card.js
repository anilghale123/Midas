import { cn } from "@/lib/utils"

const StatsCard = ({ value, label, description, icon, className, ...props }) => {
  return (
    <div
      className={cn(
        "relative bg-surface-paper p-7 lg:p-8 rounded-2xl border border-line-light",
        "shadow-card transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-100",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
          {icon}
        </div>
      )}
      <div className="text-4xl lg:text-5xl font-bold text-primary-600 tracking-tight leading-none">
        {value}
      </div>
      <div className="mt-3 text-base font-semibold text-ink">
        {label}
      </div>
      {description && (
        <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export default StatsCard
