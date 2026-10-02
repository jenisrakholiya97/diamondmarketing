// Factual data for Gigakelvin Diamonds trade marketing site
// Strictly adhering to trade-to-trade (B2B) compliance rules.

export const THEME_COLORS = [
  { id: 'diamond-luxe', label: 'Diamond Luxe', hex: '#C8A96B' },
];

export const SITE_CONFIG = {
  companyName: import.meta.env.VITE_COMPANY_NAME || "Gigakelvin Diamonds",
  brandName: "NIVVAN JEWELS",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://gigakelvin.com",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "jenis.rakholiya9081@gmail.com",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "+91 90818 47956",
  whatsappDisplay: import.meta.env.VITE_WHATSAPP_DISPLAY || "+91 90818 47956",
  sourcingBase: "Surat, Gujarat, India",
  crmEndpoint: import.meta.env.VITE_CRM_ENDPOINT || "/api/crm/quote",
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || "",
};

export const CORE_FACTS = [
  {
    title: "Surat Sourcing Base",
    desc: "Direct access to Surat CVD and HPHT synthesis & polishing units for certified lab-grown loose diamonds.",
  },
  {
    title: "Trade-Only Supply",
    desc: "Exclusively serving independent bench jewelers, custom designers, and retail studios.",
  },
  {
    title: "7-Day Insured Delivery",
    desc: "Fully insured transit to the US, Canada, UK, and Australia upon order commitment.",
  },
  {
    title: "USD Quoted & Pre-Inspected",
    desc: "Every stone is filmed in HD macro with certificate verification prior to dispatch.",
  },
];

export const SUPPLY_CAPABILITIES = {
  labGrown: {
    title: "Lab-Grown Certified Loose Diamonds",
    role: "Core Offering",
    summary: "Primary inventory category available for immediate sampling and specification-based sourcing.",
    certStandard: "IGI (International Gemological Institute) standard. GCAL 8X available on request for high-precision cut requirements.",
    caratRange: "0.30ct to 5.00ct+ (larger & custom fancy cuts on request)",
    shapes: ["Round Brilliant", "Oval", "Emerald", "Radiant", "Princess", "Pear", "Marquise", "Cushion", "Asscher"],
    colorRange: "D to H",
    clarityRange: "IF to SI1",
    sampling: "Physical sample stones available for verified trade accounts.",
  },
  customStudio: {
    title: "Custom Studio Lab-Grown Sourcing",
    role: "Precision Cut & Calibrated Lots",
    summary: "Bespoke lab-grown diamond allocations tailored to custom atelier and bench jeweler specifications.",
    certStandard: "IGI & GCAL 8X Certified Standards.",
    caratRange: "0.30ct to 5.00ct+ (larger & custom fancy cuts on request)",
    shapes: ["Round Brilliant", "Oval", "Emerald", "Radiant", "Princess", "Pear", "Marquise", "Cushion", "Asscher"],
    colorRange: "D to H",
    clarityRange: "IF to SI1",
    documentation: "Each lab-grown stone is accompanied by official IGI/GCAL certificate scan, 360° HD macro video, and high-res stone imagery.",
  },
};

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Submit Specifications",
    desc: "Send required carat, shape, color, clarity, quantity, and target timeline via quote form or WhatsApp.",
    timeframe: "Immediate submission",
  },
  {
    step: "02",
    title: "Options & USD Quote",
    desc: "We review Surat available inventory and return precise stone options with USD pricing.",
    timeframe: "Prompt response during business hours",
  },
  {
    step: "03",
    title: "50% Commitment Deposit",
    desc: "Lock in stone selection with an initial 50% deposit to initiate Surat office inspection.",
    timeframe: "Day 1",
  },
  {
    step: "04",
    title: "Physical Inspection & Cert Verification",
    desc: "Stone undergoes physical loupe verification and cert number verification in Surat.",
    timeframe: "Day 2–3",
  },
  {
    step: "05",
    title: "HD Media Approval",
    desc: "We send 360° HD macro video and certificate scan of the exact stone for your sign-off.",
    timeframe: "Day 4",
  },
  {
    step: "06",
    title: "50% Balance & Insured Dispatch",
    desc: "Upon media sign-off and balance settlement, stone is shipped via fully insured courier.",
    timeframe: "7-day total turnaround to US/UK/CA/AU",
  },
];

export const FAQ_ITEMS = [
  {
    category: "Certification & Grading",
    question: "Which gemological labs certify your loose diamonds?",
    answer: "IGI is the primary certification standard for our certified lab-grown loose diamonds. GCAL 8X certification is also available upon request for premium lab-grown stones where cut precision and symmetry are critical.",
  },
  {
    category: "Products & Audience",
    question: "Do you sell finished jewelry or mountings?",
    answer: "No. We supply loose diamonds exclusively. We do not manufacture or sell finished jewelry, mountings, or settings.",
  },
  {
    category: "Products & Audience",
    question: "Do you sell directly to general consumers?",
    answer: "No. We sell exclusively to independent jewelry business owners, bench jewelers, custom design studios, and retail jewelers.",
  },
  {
    category: "Shipping & Transit",
    question: "What are your shipping destinations and insurance terms?",
    answer: "We ship door-to-door to independent jewelers in the United States, Canada, the United Kingdom, and Australia. All shipments are 100% insured through FedEx or specialist high-value parcel couriers.",
  },
  {
    category: "Commercial Terms",
    question: "What are the payment terms?",
    answer: "Standard terms for new trade clients are a 50% deposit upon stone selection and the remaining 50% prior to dispatch after approving the HD video and cert scan of the actual stone. Established clients with order history may request extended terms.",
  },
  {
    category: "Quality Control",
    question: "How do I verify the stone before it is shipped from Surat?",
    answer: "Before final payment and dispatch, we provide a 360° high-definition macro video and high-resolution certificate scan of the exact stone matching the certificate serial number.",
  },
  {
    category: "Shipping & Duties",
    question: "How are import duties and customs handled?",
    answer: "All commercial shipments include complete commercial invoice documentation for customs clearance. Import duty rules vary by destination country and are processed according to standard international courier procedures.",
  },
  {
    category: "Sampling & Testing",
    question: "Can I inspect sample stones for lab-grown inventory?",
    answer: "Yes. Verified trade accounts can request physical sample stones from our lab-grown core supply to evaluate cut quality and clarity in-hand before committing to volume orders.",
  },
];
