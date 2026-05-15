import { cn } from "@/lib/utils";

const STYLES = {
  SUPER_ADMIN: "bg-brand/15 text-brand",
  EDITOR: "bg-info-light text-info-text",
};

const DEFAULT = "bg-surface-tertiary text-text-secondary";

export default function RoleBadge({ role, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        STYLES[role] ?? DEFAULT,
        className
      )}
    >
      {role}
    </span>
  );
}
