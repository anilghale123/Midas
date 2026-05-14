export const navigationData = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Our Services", href: "/services" },
      { name: "Downloads", href: "/services/downloads" },
    ],
  },
  { name: "FAQ", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
  { name: "Sanction List", href: "/compliance/sanction-lists" },
]

export const authLinks = [
  { name: "NEPSE Login", href: "https://tms21.nepsetms.com.np" },
  { name: "MIDAS Login", href: "/login" },
  { name: "Demat Login", href: "https://meroshare.cdsc.com.np/" },
]
