import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PageLoader({ className, label = "Loading…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[40vh] items-center justify-center text-brand",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin-slow" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
