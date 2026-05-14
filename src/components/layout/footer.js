import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Shield,
  UserCheck,
  ExternalLink,
} from "lucide-react"

const FacebookIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H17V4.3c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.4v2.4H7.5v3h2.5V21h3.5z" />
  </svg>
)
import Container from "@/components/ui/container"
import { footerData as defaultFooter } from "@/data/footer"

const Footer = ({ data }) => {
  // Footer accepts either the legacy shape (columns: { Title: [...] }) or the
  // CMS-normalised shape (columns: [{ title, links }, ...]). Normalise to the
  // legacy shape for rendering.
  const raw = data ?? defaultFooter

  const columns = Array.isArray(raw.columns)
    ? Object.fromEntries(raw.columns.map((c) => [c.title, c.links ?? []]))
    : (raw.columns ?? {})

  const footerData = { ...raw, columns }
  const g = footerData.grievanceOfficer ?? {}

  // Contact strip — derived from grievance officer + first phone in regulatoryLinks-adjacent data
  const contactItems = [
    g.phone && { icon: Phone, label: g.phone, href: `tel:${g.phone}` },
    g.email && { icon: Mail,  label: g.email, href: `mailto:${g.email}` },
    { icon: MapPin, label: "Kamaladi Mode, Kathmandu, Nepal" },
  ].filter(Boolean)

  return (
    <footer className="bg-surface-dark text-white/75">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-primary-900 shadow-md">
                <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                MIDAS
              </span>
            </Link>

            <p className="text-white/65 leading-relaxed max-w-sm mb-6 text-[15px]">
              {footerData.companyBio}
            </p>

            <ul className="space-y-3 text-sm">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/80 shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  {href ? (
                    <a href={href} className="hover:text-white transition-colors">{label}</a>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Socials */}
            {footerData.socialLinks?.length > 0 && (
              <div className="mt-6 flex items-center gap-2.5">
                {footerData.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {s.platform === "Facebook" ? (
                      <FacebookIcon className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {Object.entries(footerData.columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white text-sm font-semibold mb-5 tracking-wide uppercase">
                  {title}
                </h4>
                <ul className="space-y-3 text-sm">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/65 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Grievance Officer card */}
          <div className="lg:col-span-4">
            <h4 className="text-white text-sm font-semibold mb-5 tracking-wide uppercase">
              Grievance Officer
            </h4>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-primary-900 shadow-md">
                  <UserCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-white text-[15px] font-semibold leading-tight">
                    {g.name}
                  </div>
                  <div className="text-xs text-white/55 mt-0.5">{g.role}</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={`tel:${g.phone}`}
                    className="inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-brand-400" />
                    {g.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${g.email}`}
                    className="inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors break-all"
                  >
                    <Mail className="h-4 w-4 text-brand-400 shrink-0" />
                    {g.email}
                  </a>
                </li>
              </ul>

              <p className="mt-4 text-xs text-white/50 leading-relaxed">
                For service-related complaints, escalations, or regulatory concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-xs uppercase tracking-wider text-white/45 mb-4">
            Regulatory ecosystem
          </div>
          <div className="flex flex-wrap gap-2.5">
            {footerData.regulatoryLinks.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors"
              >
                {r.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Compliance strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-white/55">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-success-400" />
            <span>
              Regulated by {footerData.regulator} — Broker #{footerData.brokerNumber}
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} MIDAS Stock Broking. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
