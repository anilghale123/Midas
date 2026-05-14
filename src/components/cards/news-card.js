import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import Badge from "@/components/ui/badge"

const categoryVariant = {
  AGM: "primary",
  Dividend: "success",
  Holiday: "gold",
  default: "default",
}

const NewsCard = ({ id, title, date, category, excerpt, className, ...props }) => {
  const variant = categoryVariant[category] ?? categoryVariant.default

  return (
    <Link
      href={`/notices/${id}`}
      className={cn(
        "group block bg-surface-paper p-7 rounded-2xl border border-line-light",
        "shadow-card transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-100",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <Badge variant={variant}>{category}</Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-ink mb-2.5 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>

      <p className="text-ink-muted text-[15px] leading-relaxed line-clamp-3 mb-5">
        {excerpt}
      </p>

      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
        Read notice
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export default NewsCard
