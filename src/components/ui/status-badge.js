import { cn } from "@/lib/utils";

export default function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive", className }) {
  const isActive = Boolean(active);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge px-2.5 py-0.5 text-xs font-medium",
        isActive ? "bg-success-light text-success-text" : "bg-danger-light text-danger-text",
        className
      )}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
