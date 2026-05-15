import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-tertiary",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        "before:bg-[length:200%_100%] before:animate-shimmer",
        className
      )}
    />
  );
}

export default Skeleton;
