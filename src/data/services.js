export const servicesContent = {
  eyebrow: "Our Services",
  title: "Trade, custody, and reporting — all in one place.",
  subtitle:
    "Three trusted services, designed to take you from KYC to capital-gains reporting without friction.",
  servicesList: [
    {
      id: "nepse-online",
      title: "NEPSE Online Trading Account",
      type: "External Portal",
      accent: "nepse",
      description:
        "Execute trades from home without phone calls. Sign the agreement form and receive your NEPSE login URL.",
      href: "https://tms21.nepsetms.com.np",
      actionText: "NEPSE Login",
      external: true,
    },
    {
      id: "midas-account",
      title: "Semi-Online MIDAS Account",
      type: "Internal Ledger",
      accent: "midas",
      description:
        "A proprietary portal to view bills, receipts, account statements, and capital gain tax reports.",
      href: "/login",
      actionText: "MIDAS Login",
      external: false,
    },
    {
      id: "depository-services",
      title: "Depository & DEMAT Services",
      type: "External Portal",
      accent: "demat",
      description:
        "Partnered with Nepal DP Limited. Access MeroShare online, apply for IPOs, and manage EDIS.",
      href: "https://meroshare.cdsc.com.np/",
      actionText: "Demat Login",
      external: true,
    },
  ],
  serviceCharges: {
    brokerageCommission: {
      title: "Brokerage Commission",
      note: "All transactions attract an additional 0.015% SEBON regulatory fee.",
      headers: ["Trade Volume (NPR)", "Commission Rate"],
      tiers: [
        { volume: "Up to Rs. 50,000",                rate: "0.40%" },
        { volume: "Rs. 50,001 to Rs. 500,000",       rate: "0.37%" },
        { volume: "Rs. 500,001 to Rs. 2,000,000",    rate: "0.34%" },
        { volume: "Rs. 2,000,001 to Rs. 10,000,000", rate: "0.30%" },
        { volume: "Above Rs. 10,000,000",            rate: "0.27%" },
      ],
    },
    dematFees: {
      title: "DEMAT & Depository Fees",
      note: "Fees are charged in line with CDSC guidelines and are non-refundable.",
      headers: ["Service", "Charge"],
      rows: [
        { type: "Demat Account Opening",   charge: "Rs. 50 (One Time)" },
        { type: "Annual Maintenance Fee",  charge: "Rs. 100 per Annum" },
        { type: "Pledge / Unpledge Fees",  charge: "Rs. 50 per Pledge/Unpledge" },
        { type: "On Market Transactions",  charge: "Rs. 25 per Transfer" },
      ],
    },
  },
}

export const downloadsContent = {
  eyebrow: "Downloads",
  title: "Forms & documents",
  subtitle:
    "All the forms you need to open an account, update your details, or transfer your holdings.",
  files: [
    {
      title: "KYC Form (Individual)",
      description: "Complete the KYC form to open a trading account with MIDAS.",
      href: "#",
      type: "PDF",
    },
    {
      title: "DEMAT Account Opening Form",
      description: "Apply for a DEMAT account through our partner Nepal DP Limited.",
      href: "#",
      type: "PDF",
    },
    {
      title: "Delivery Instruction Slip (DIS)",
      description: "Use this form to transfer or sell shares from your DEMAT account.",
      href: "#",
      type: "PDF",
    },
    {
      title: "Bank Account Update Form",
      description: "Update or change the bank account linked to your MIDAS account.",
      href: "#",
      type: "PDF",
    },
  ],
}
