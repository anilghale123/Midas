"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FaqAccordion = ({ items, defaultOpenId }) => {
  const [openId, setOpenId] = useState(defaultOpenId ?? items?.[0]?.id ?? null)

  return (
    <ul className="divide-y divide-line-light rounded-2xl border border-line-light bg-surface-paper shadow-card overflow-hidden">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className={cn(
                "w-full flex items-center justify-between gap-6 text-left",
                "px-6 sm:px-8 py-5 sm:py-6 transition-colors",
                "hover:bg-surface-alt",
                isOpen && "bg-surface-alt"
              )}
            >
              <span className="text-base sm:text-lg font-semibold text-ink tracking-tight">
                {item.question}
              </span>
              <span
                className={cn(
                  "shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full",
                  "border border-line-light bg-surface-paper text-ink-secondary",
                  "transition-transform duration-300",
                  isOpen && "rotate-180 bg-primary-50 text-primary-600 border-primary-100"
                )}
                aria-hidden
              >
                <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </button>

            <div
              id={`faq-panel-${item.id}`}
              role="region"
              hidden={!isOpen}
              className="px-6 sm:px-8 pb-6 sm:pb-7 -mt-1"
            >
              <p className="text-ink-secondary leading-relaxed text-[15px] max-w-3xl">
                {item.answer}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default FaqAccordion
