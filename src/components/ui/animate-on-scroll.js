"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Map declarative prop -> literal class so Tailwind v4 content scanning
// detects the animation utilities.
const ANIMATIONS = {
  "fade-up": "animate-fade-up",
  "fade-in": "animate-fade-in",
  "fade-down": "animate-fade-down",
  "slide-in-left": "animate-slide-in-left",
  "slide-in-right": "animate-slide-in-right",
  "scale-in": "animate-scale-in",
};

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
  as: Tag = "div",
  className,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  const animClass = ANIMATIONS[animation] ?? ANIMATIONS["fade-up"];

  return (
    <Tag
      ref={ref}
      className={cn(visible ? animClass : "opacity-0", className)}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
