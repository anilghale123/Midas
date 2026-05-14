export const heroData = {
  eyebrow: "Nepal's Trusted Stock Broker · #21",
  title: "OWN YOUR SHARES TODAY",
  subtitle:
    "Trade shares of over 250 companies listed in Nepal Stock Exchange with MIDAS. Start your journey in the capital market with a trusted, SEBON-regulated broker.",
  primaryButton: { text: "Register Now",     href: "/services/downloads" },
  secondaryButton: { text: "Explore Services", href: "/services" },
  trustBadges: [
    { label: "SEBON Regulated", tone: "success" },
    { label: "Broker #21",      tone: "gold"    },
    { label: "250+ Companies",  tone: "primary" },
  ],
  stats: [
    { value: "250+",    label: "Companies Listed" },
    { value: "#21",     label: "Broker Number" },
    { value: "Sun-Fri", label: "Live Support" },
  ],
  dashboard: {
    indexLabel: "NEPSE Index",
    indexValue: "2,148.36",
    indexChange: "+24.18",
    indexPercent: "+1.14%",
    isPositive: true,
    tickers: [
      { symbol: "NABIL", name: "Nabil Bank",      price: "542.10", change: "+1.8%", up: true  },
      { symbol: "NICA",  name: "NIC Asia Bank",   price: "812.40", change: "+0.9%", up: true  },
      { symbol: "NTC",   name: "Nepal Telecom",   price: "923.00", change: "-0.3%", up: false },
      { symbol: "HBL",   name: "Himalayan Bank",  price: "267.50", change: "+2.4%", up: true  },
      { symbol: "ADBL",  name: "Agriculture Dev", price: "318.20", change: "-0.6%", up: false },
    ],
  },
}

export const marketStatsData = [
  { value: "250+",    label: "Companies Listed", description: "Trade the full universe of NEPSE-listed equities." },
  { value: "#21",     label: "SEBON Broker Number", description: "Licensed and regulated broker member of NEPSE." },
  { value: "Sun-Fri", label: "Live Support", description: "Real human advisors on every business day." },
]

export const accountTypesData = [
  {
    title: "NEPSE Online Trading",
    badge: "Trading",
    accent: "nepse",
    description:
      "Execute trades from home without phone calls. Sign the agreement form and receive your NEPSE login URL.",
    features: ["Live NEPSE order book", "Real-time market data", "Place orders 24/7"],
    buttonText: "Open NEPSE Account",
  },
  {
    title: "Semi-Online MIDAS Account",
    badge: "Reporting",
    accent: "midas",
    highlighted: true,
    description:
      "A proprietary portal to view bills, receipts, account statements, and capital gain tax reports.",
    features: ["Bills & receipts", "Account statements", "Capital gain tax reports"],
    buttonText: "Open MIDAS Account",
  },
  {
    title: "Depository & DEMAT",
    badge: "Custody",
    accent: "demat",
    description:
      "Partnered with Nepal DP Limited. Access MeroShare online, apply for IPOs, and manage EDIS.",
    features: ["Digital share certificates", "Apply for IPOs", "Bank-grade custody"],
    buttonText: "Open Demat Account",
  },
]

// Mirrors `featuresArray` from pagescontent.md — used as "Why Trade Shares"
export const whyTradeSharesData = [
  {
    title: "Reap benefit from bull or bear markets",
    description:
      "Traders can benefit from rising or falling prices by buying and selling in the stock market.",
    iconName: "TrendingUp",
  },
  {
    title: "Minimize risk through diversification",
    description:
      "Reap high returns through a diversified portfolio by investing in different sectors for risk management.",
    iconName: "PieChart",
  },
  {
    title: "Embrace technological innovation",
    description:
      "Midas believes technology is a boon to the stock industry and embraces digital platforms for seamless trading.",
    iconName: "Cpu",
  },
  {
    title: "High ethical standards",
    description:
      "Midas is a regulated stock broker company and strongly believes in ethical trading so you can trade with trust.",
    iconName: "ShieldCheck",
  },
]

export const whyMidasData = [
  {
    title: "Institutional trust",
    description:
      "A SEBON-regulated broker (#21) with a clean compliance record and a long-standing reputation in NEPSE.",
  },
  {
    title: "Fully regulated",
    description:
      "Licensed by the Securities Board of Nepal and operating under Nepal's strictest financial compliance standards.",
  },
  {
    title: "Modern trading tech",
    description:
      "NEPSE online trading, digital DEMAT services, and a back-office portal — all built to work together.",
  },
  {
    title: "Real human support",
    description:
      "Dedicated advisors and live client support every business day from our Kathmandu and Butwal offices.",
  },
]

export const tradingProcessData = [
  {
    step: "01",
    title: "Open your account",
    description:
      "Fill out the KYC form along with a photograph and a copy of your citizenship — account opening is free of cost.",
  },
  {
    step: "02",
    title: "Get verified",
    description:
      "Submit your documents — we review and approve your account quickly under SEBON guidelines.",
  },
  {
    step: "03",
    title: "Start trading",
    description:
      "Access NEPSE online, manage your DEMAT, and view all your reports from a single dashboard.",
  },
]

export const latestNoticesData = [
  {
    id: 1,
    title: "Annual General Meeting Notice — Nabil Bank Limited",
    date: "2026-05-15",
    category: "AGM",
    excerpt:
      "Notice for the Annual General Meeting of Nabil Bank Limited, including agenda, venue details, and shareholder voting procedure.",
  },
  {
    id: 2,
    title: "Dividend Declaration — Global IME Bank",
    date: "2026-05-10",
    category: "Dividend",
    excerpt:
      "Global IME Bank has announced a 12% dividend for fiscal year 2080/81, payable to shareholders on record before the book closure date.",
  },
  {
    id: 3,
    title: "Market Holiday Notice — Buddha Jayanti",
    date: "2026-05-08",
    category: "Holiday",
    excerpt:
      "NEPSE and clearing operations will remain closed on May 15 for Buddha Jayanti. Trading will resume on the next business day.",
  },
]

export const newsletterData = {
  title: "Stay ahead of the market",
  description:
    "Get curated market insights, weekly analysis, and company announcements delivered straight to your inbox.",
  placeholder: "your.email@example.com",
  buttonText: "Subscribe",
  microcopy: "No spam — unsubscribe anytime.",
}
