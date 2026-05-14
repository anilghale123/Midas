// ==========================================
// NAVIGATION & FOOTER CONFIG
// ==========================================

export const navigationConfig = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Our Services', href: '/services' },
      { label: 'Downloads', href: '/services/downloads' },
    ],
  },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Targeted Sanction List', href: '/compliance/sanction-lists' },
];

export const footerConfig = {
  companyBio: "Midas Stock Broking Company is a regulated stock broker company under Nepal Stock Exchange (NEPSE) dedicated to providing efficient execution and portfolio management services.",
  regulatoryLinks: [
    { label: "Nepse", href: "http://www.nepalstock.com/" },
    { label: "Sebon", href: "https://www.sebon.gov.np/" },
    { label: "Nrb", href: "https://www.nrb.org.np/" },
    { label: "Beema Samiti", href: "https://nib.gov.np/" },
    { label: "Cdsc", href: "https://www.cdsc.com.np/" }
  ],
  socialLinks: [
    { platform: "Facebook", url: "https://www.facebook.com/midasstockbroking" }
  ]
};

// ==========================================
// HOMEPAGE DATA
// ==========================================

export const heroData = {
  title: "OWN YOUR SHARES TODAY!",
  description: "Trade shares of over 250 companies listed in Nepal Stock Exchange with MIDAS. Start your journey in the capital market with a trusted broker.",
  ctaText: "Register Now",
  ctaLink: "/services/downloads",
};

export const featuresArray = [
  {
    id: "f1",
    iconName: "TrendingUp",
    title: "Reap benefit from bull or bear market",
    description: "Traders can benefit from rising or falling prices by buying and selling in the stock market."
  },
  {
    id: "f2",
    iconName: "PieChart",
    title: "Minimize risk from Diversification",
    description: "Reap high returns through a diversified portfolio by investing in different sectors for risk management."
  },
  {
    id: "f3",
    iconName: "Cpu",
    title: "Encourage Technological Innovation",
    description: "Midas believes technology is a boon to the stock industry and embraces digital platforms for seamless trading."
  },
  {
    id: "f4",
    iconName: "ShieldCheck",
    title: "High Ethical Standards",
    description: "Midas is a regulated stock broker company and strongly believes in ethical trading so you can trade with trust."
  }
];

export const statsArray = [
  { id: "s1", label: "Companies Listed", value: "250+" },
  { id: "s2", label: "Broker Number", value: "21" },
  { id: "s3", label: "Live Support", value: "Sun-Fri" }
];

// ==========================================
// INTERNAL PAGE DATA
// ==========================================

export const aboutContent = {
  title: "About MIDAS",
  brokerNumber: "21",
  regulatoryBody: "Securities Board of Nepal (SEBON)",
  introduction: "Midas Stock Broking Company Pvt. Ltd. is a licensed stock brokerage firm regulated by the Securities Board of Nepal (SEBON) and located at Putalisadak, Kamaladi Mod, Kathmandu, Nepal. Recognized as the 21st broker member of the Nepal Stock Exchange Ltd. (NEPSE), we provide comprehensive order execution and depository services.",
  mission: "Committed to empowering investors through knowledge and expertise, MIDAS serves as a trusted bridge between traders and companies, helping clients make informed decisions.",
  accessibility: "To expand accessibility, we have established a Remote Work Station (RWS) in Butwal, enabling investors from across the region to access our services with ease.",
  coreValues: ["Ethical Values", "Exceptional Customer Service", "Cutting-edge Technology"]
};

export const servicesContent = {
  header: "Our Services",
  servicesList: [
    {
      id: "nepse-online",
      title: "NEPSE Online Trading Account",
      type: "External Portal",
      description: "Execute trades from home without phone calls. Sign the agreement form and receive your NEPSE login URL.",
      href: "https://tms21.nepsetms.com.np",
      actionText: "Nepse Login"
    },
    {
      id: "midas-account",
      title: "Semi-Online MIDAS Account",
      type: "Internal Ledger",
      description: "A proprietary portal to view bills, receipts, account statements, and capital gain tax reports.",
      href: "/login",
      actionText: "Midas Login"
    },
    {
      id: "depository-services",
      title: "Depository & DEMAT Services",
      type: "External Portal",
      description: "Partnered with Nepal DP Limited. Access MeroShare online, apply for IPOs, and manage EDIS.",
      href: "https://meroshare.cdsc.com.np/",
      actionText: "Demat Login"
    }
  ],
  serviceCharges: {
    brokerageCommission: {
      note: "All transactions attract an additional 0.015% SEBON regulatory fee.",
      tiers: [
        { volume: "Up to Rs. 50,000", rate: "0.40%" }, 
        { volume: "Rs. 50,001 to Rs. 500,000", rate: "0.37%" },
        { volume: "Rs. 500,001 to Rs. 2,000,000", rate: "0.34%" },
        { volume: "Rs. 2,000,001 to Rs. 10,000,000", rate: "0.30%" },
        { volume: "Above Rs. 10,000,000", rate: "0.27%" }
      ]
    },
    dematFees: [
      { type: "Demat Account Opening", charge: "Rs. 50 (One Time)" },
      { type: "Annual Maintenance Fee", charge: "Rs. 100 per Annum" },
      { type: "Pledge / Unpledge Fees", charge: "Rs. 50 Per Pledge/Unpledge" },
      { type: "On Market Transactions", charge: "Rs. 25 Per Transfer" }
    ]
  }
};

export const faqContent = [
  {
    id: "faq-1",
    question: "How can I open an account at Midas?",
    answer: "You need to fill up our KYC form along with one passport size photograph and a photocopy of your citizenship certificate. The account is opened free of cost."
  },
  {
    id: "faq-2",
    question: "By when do we have to make payment after purchasing shares?",
    answer: "Payment is made based on the T+2 settlement system. This means customers need to pay within 2 days after purchasing shares. Settlement is carried out only after payment is made."
  },
  {
    id: "faq-3",
    question: "What is a DEMAT account and can I open it at Midas?",
    answer: "A DEMAT Account allows you to hold shares in electronic form. Yes, you can open it at Midas through our partner Nepal DP Limited."
  },
  {
    id: "faq-4",
    question: "By when do we have to submit the DIS/EDIS?",
    answer: "Delivery Instruction Slip (DIS) or EDIS needs to be submitted by the next day of selling shares."
  },
  {
    id: "faq-5",
    question: "What is the difference between the Midas Account and NEPSE Online Account?",
    answer: "The NEPSE Online Account is used to place actual buy and sell orders in the market. The Midas Account is a back-office facility to view your bills, receipts, account statements, and capital gains tax reports."
  }
];

export const contactContent = {
  locations: [
    {
      type: "Head Office",
      address: "Kamaladi Mode, Kathmandu Nepal",
      emails: ["inquiry@midasstock.com.np", "midasstock@gmail.com"],
      phones: ["01-5970056"]
    },
    {
      type: "Branch Office",
      address: "Rajmarg Chouraha, Butwal-9",
      emails: ["butwal@midasstock.com.np"],
      phones: ["071-438332", "071-438336"]
    }
  ],
  grievanceOfficer: {
    name: "Anuj Pandit",
    phone: "9801030123",
    email: "inquiry@midasstock.com.np"
  }
};

export const sanctionLinksContent = {
  title: "Targeted Sanction Lists",
  description: "In compliance with the Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT) directives issued by SEBON and the Government of Nepal, Midas Stock Broking screens and monitors all accounts against the following targeted sanction lists.",
  lists: [
    {
      title: "UN Consolidated Sanction List",
      description: "The United Nations Security Council Consolidated List.",
      url: "https://scsanctions.un.org/consolidated/"
    },
    {
      title: "APG Sanction List",
      description: "Asia/Pacific Group on Money Laundering compliance list.",
      url: "http://www.apgml.org/"
    },
    {
      title: "MoHA (Ministry of Home Affairs, Nepal)",
      description: "Domestic sanction and terrorist designation lists issued by the Government of Nepal.",
      url: "https://moha.gov.np/"
    }
  ]
};