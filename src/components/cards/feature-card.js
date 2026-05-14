import { cn } from "@/lib/utils"

const FeatureCard = ({
  title,
  description,
  icon,
  iconTone = "primary",
  className,
  ...props
}) => {
  const iconTones = {
    primary: "bg-primary-50 text-primary-600 ring-1 ring-primary-100",
    success: "bg-success-50 text-success-600 ring-1 ring-success-100",
    gold:    "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
  }

  return (
    <article
      className={cn(
        "group relative bg-surface-paper p-7 lg:p-8 rounded-2xl",
        "border border-line-light shadow-card",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-100",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-5",
            "transition-transform duration-300 group-hover:scale-105",
            iconTones[iconTone]
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg lg:text-xl font-semibold text-ink mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-ink-muted leading-relaxed text-[15px]">
        {description}
      </p>
    </article>
  )
}

export default FeatureCard
