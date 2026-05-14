"use client"

import Link from "next/link"
import { Menu, X, TrendingUp, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import CTAButton from "@/components/ui/cta-button"
import { navigationData as defaultNav, authLinks as defaultAuth } from "@/data/navigation"

const portalAccent = {
  "NEPSE Login": "bg-portal-nepse",
  "MIDAS Login": "bg-portal-midas",
  "Demat Login": "bg-portal-demat",
}

const Header = ({ navigation, authLinks }) => {
  const navigationData = navigation?.length ? navigation : defaultNav
  const linkSet = authLinks?.length ? authLinks : defaultAuth
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openMobileSub, setOpenMobileSub] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-line-light shadow-sm"
          : "bg-white border-b border-line-light/60"
      )}
    >
      {/* Top auth bar */}
      <div className="hidden lg:block bg-primary-900 text-white/85 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end gap-6 py-2">
          {linkSet.map((link) => {
            const isExternal = link.href?.startsWith("http")
            return (
              <Link
                key={link.name}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    portalAccent[link.name] ?? "bg-white/40"
                  )}
                />
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-md ring-1 ring-primary-700/30 transition-transform group-hover:scale-105">
              <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold tracking-tight text-primary-700">
              MIDAS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationData.map((item) =>
              item.children ? (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-ink-secondary rounded-lg hover:text-primary-600 hover:bg-primary-50/60 transition-colors"
                  >
                    {item.name}
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform group-hover:rotate-180"
                      strokeWidth={2.5}
                    />
                  </Link>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full pt-2 transition-all duration-200">
                    <div className="min-w-50 rounded-xl border border-line-light bg-white shadow-lg p-1.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-secondary hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3.5 py-2 text-sm font-medium text-ink-secondary rounded-lg hover:text-primary-600 hover:bg-primary-50/60 transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <CTAButton variant="ghost" size="sm" href="/login">
              Sign in
            </CTAButton>
            <CTAButton variant="primary" size="sm" href="/services/downloads">
              Open Account
            </CTAButton>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-ink rounded-lg hover:bg-surface-alt transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-5 pt-1 animate-fade-in">
            <nav className="flex flex-col gap-1 border-t border-line-light pt-4">
              {navigationData.map((item) =>
                item.children ? (
                  <div key={item.name} className="rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileSub(openMobileSub === item.name ? null : item.name)
                      }
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-ink-secondary rounded-lg hover:bg-surface-alt hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openMobileSub === item.name && "rotate-180"
                        )}
                      />
                    </button>
                    {openMobileSub === item.name && (
                      <div className="pl-3 pb-1 flex flex-col">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 text-sm text-ink-muted rounded-lg hover:bg-surface-alt hover:text-primary-600 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2.5 text-sm font-medium text-ink-secondary rounded-lg hover:bg-surface-alt hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}

              <div className="mt-3 pt-3 border-t border-line-light grid grid-cols-1 gap-2">
                {linkSet.map((link) => {
                  const isExternal = link.href?.startsWith("http")
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm text-ink-muted rounded-lg hover:bg-surface-alt"
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", portalAccent[link.name])} />
                      {link.name}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <CTAButton variant="secondary" size="sm" href="/login">Sign in</CTAButton>
                <CTAButton variant="primary" size="sm" href="/services/downloads">Open Account</CTAButton>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
