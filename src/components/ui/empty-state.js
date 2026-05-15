import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center animate-fade-up",
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-surface-tertiary p-3 text-text-muted">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      {title && <h3 className="text-base font-semibold text-text-primary">{title}</h3>}
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
