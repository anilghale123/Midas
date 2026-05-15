import { cn } from "@/lib/utils";

export default function PageTransition({ children, className = "" }) {
  return <div className={cn("animate-fade-up", className)}>{children}</div>;
}
