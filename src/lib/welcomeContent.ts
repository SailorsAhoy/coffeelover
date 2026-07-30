import { Store, Package, Coffee, BookOpen, ShoppingBag, PenLine, GraduationCap, Briefcase, BookMarked, MessageSquare, Library, type LucideIcon } from "lucide-react";

export interface WelcomeExample {
  /** Small label above the card, e.g. "Example roaster" */
  kicker: string;
  name: string;
  meta: string;
  description: string;
  tags: string[];
  /** Optional highlight, e.g. a price or rating */
  highlight?: string;
}

export interface WelcomeContent {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  example: WelcomeExample;
}

export const WELCOME_CONTENT: Record<string, WelcomeContent> = {
  shops: {
    slug: "shops",
    title: "Coffee Shops",
    tagline: "Specialty coffee, near you.",
    description: "Discover curated cafés with photos, hours and reviews.",
    bullets: ["Filter by location & amenities", "Live open/closed status", "Save favorites"],
    icon: Store,
    example: {
      kicker: "Example coffee shop",
      name: "Rue Sainte Coffee",
      meta: "Marseille, France · Open until 18:00",
      description: "Third-wave café with a rotating single-origin filter bar and house-baked pastries.",
      tags: ["Wi-Fi", "Outdoor seating", "V60"],
      highlight: "★ 4.8 (126 reviews)",
    },
  },
  roasters: {
    slug: "roasters",
    title: "Roasters",
    tagline: "Meet the makers behind the beans.",
    description: "Follow independent roasters and shop their coffees direct.",
    bullets: ["Roaster stories & sourcing", "Shipping regions at a glance", "Claim your roastery"],
    icon: Package,
    example: {
      kicker: "Example roaster",
      name: "Nordheim Roastery",
      meta: "Oslo, Norway · Ships to EU & UK",
      description: "Light-roast specialists working directly with producers in Ethiopia and Colombia.",
      tags: ["Direct trade", "Light roast", "Subscriptions"],
      highlight: "24 coffees listed",
    },
  },
  coffee: {
    slug: "coffee",
    title: "Coffee Beans",
    tagline: "Find your next favorite bag.",
    description: "Search specialty beans by origin, process, roast and price.",
    bullets: ["Origin, variety & process filters", "Currency & region aware", "Add to your brewing journal"],
    icon: Coffee,
    example: {
      kicker: "Example coffee",
      name: "Yirgacheffe Konga",
      meta: "Ethiopia · Washed · Heirloom",
      description: "Jasmine, bergamot and stone fruit. Roasted for filter, shipped within 48h of roast.",
      tags: ["Filter roast", "Floral", "250 g / 1 kg"],
      highlight: "€ 38.00 / kg",
    },
  },
  guides: {
    slug: "guides",
    title: "Brewing Guides",
    tagline: "Master every method.",
    description: "Step-by-step recipes for espresso, pour over, AeroPress and more.",
    bullets: ["Ratios & grind sizes", "Timing & temperature", "Troubleshooting tips"],
    icon: BookOpen,
    example: {
      kicker: "Example guide",
      name: "The Perfect V60 Pour Over",
      meta: "6 steps · 3–4 minutes · Intermediate",
      description: "15 g coffee to 250 g water at 93 °C, bloom 45 s, then two even pours.",
      tags: ["1:16.6 ratio", "Medium-fine grind", "93 °C"],
      highlight: "Beginner friendly",
    },
  },
  recipes: {
    slug: "recipes",
    title: "Recipes",
    tagline: "Delicious coffee drinks.",
    description: "Classic and creative recipes shared by the community.",
    bullets: ["Full ingredient lists", "Prep time & servings", "Community favorites"],
    icon: BookOpen,
    example: {
      kicker: "Example recipe",
      name: "Espresso Tonic",
      meta: "Cold · Cocktail style · 5 minutes",
      description: "Double espresso poured over iced tonic water with an orange twist.",
      tags: ["Cold", "Citrus", "Easy"],
      highlight: "★ 4.6 · 2.1k views",
    },
  },
  equipment: {
    slug: "equipment",
    title: "Equipment",
    tagline: "Gear up for great coffee.",
    description: "Machines, grinders, brewers and accessories from top brands.",
    bullets: ["Filter by brand & type", "Compare specs", "Owner reviews"],
    icon: ShoppingBag,
    example: {
      kicker: "Example equipment",
      name: "Comandante C40 Grinder",
      meta: "Hand grinder · Stainless burrs",
      description: "Reference-grade manual grinder with repeatable click adjustment for filter and espresso.",
      tags: ["Manual", "Travel", "Filter & espresso"],
      highlight: "€ 265.00",
    },
  },
  journal: {
    slug: "journal",
    title: "Brewing Journal",
    tagline: "Track every cup.",
    description: "Log products, gear and brew sessions to dial in your perfect cup.",
    bullets: ["Dose, yield, time & TDS", "Score aroma & body", "Your personal coffee history"],
    icon: PenLine,
    example: {
      kicker: "Example brew log",
      name: "Kenya Kirinyaga · Espresso",
      meta: "18.0 g in → 39.5 g out · 28 s",
      description: "Blackcurrant and brown sugar. Slightly tight — grind one step coarser next time.",
      tags: ["TDS 9.4%", "Score 8.5", "Setting 2.4"],
      highlight: "Logged today",
    },
  },
  academy: {
    slug: "academy",
    title: "Barista Academy",
    tagline: "Learn from the pros.",
    description: "Courses from first pull to advanced barista technique.",
    bullets: ["Video lessons & materials", "Progress tracking", "Certificates on completion"],
    icon: GraduationCap,
    example: {
      kicker: "Example course",
      name: "Latte Art Foundations",
      meta: "8 lessons · 2h 40m · Beginner",
      description: "Milk texturing, pouring position and the three core patterns: heart, rosetta, tulip.",
      tags: ["Video", "Downloads", "Certificate"],
      highlight: "★ 4.9 · 840 students",
    },
  },
  jobs: {
    slug: "jobs",
    title: "Coffee Jobs",
    tagline: "Careers in specialty coffee.",
    description: "Barista, roaster, buyer and management roles worldwide.",
    bullets: ["Filter by role & location", "Apply directly", "Post openings as a business"],
    icon: Briefcase,
    example: {
      kicker: "Example job",
      name: "Head Barista — Full time",
      meta: "Lisbon, Portugal · On site",
      description: "Lead a team of four, run the bar programme and manage espresso calibration.",
      tags: ["Full time", "2+ years", "SCA welcome"],
      highlight: "€ 1,600–1,900 / month",
    },
  },
  wiki: {
    slug: "wiki",
    title: "Coffee Wiki",
    tagline: "The coffee knowledge base.",
    description: "Varieties, origins, processes and techniques — all searchable.",
    bullets: ["Deep-dive articles", "Community edits", "Beginner to expert"],
    icon: BookMarked,
    example: {
      kicker: "Example article",
      name: "Natural (Dry) Processing",
      meta: "Processing · 6 min read",
      description: "Whole cherries dried in the sun, producing fruity, wine-like and full-bodied cups.",
      tags: ["Fruity", "Sweet", "Full body"],
      highlight: "Community edited",
    },
  },
  forum: {
    slug: "forum",
    title: "Coffee Forum",
    tagline: "Talk coffee with the community.",
    description: "Discuss brewing, gear, beans and everything in between.",
    bullets: ["Ask & answer questions", "Share your setup", "Follow experts"],
    icon: MessageSquare,
    example: {
      kicker: "Example thread",
      name: "Why does my espresso channel?",
      meta: "Espresso · 34 replies",
      description: "Distribution, puck prep and basket condition — the community troubleshoots step by step.",
      tags: ["Espresso", "Troubleshooting", "Hot topic"],
      highlight: "Last reply 2h ago",
    },
  },
  library: {
    slug: "library",
    title: "Coffee Library",
    tagline: "The best coffee reads.",
    description: "Curated books on coffee, brewing, roasting and culture.",
    bullets: ["Reviews & recommendations", "Browse by topic", "Community ratings"],
    icon: Library,
    example: {
      kicker: "Example book",
      name: "The World Atlas of Coffee",
      meta: "James Hoffmann · English",
      description: "Origins, varieties and brewing, mapped country by country — the modern reference.",
      tags: ["Reference", "Origins", "Brewing"],
      highlight: "★ 4.8",
    },
  },
  messages: {
    slug: "messages",
    title: "Messages",
    tagline: "Chat with the coffee community.",
    description: "Direct messages with roasters, shops and fellow enthusiasts.",
    bullets: ["Real-time chat", "Follow & friend requests", "Notification bell built in"],
    icon: MessageSquare,
    example: {
      kicker: "Example conversation",
      name: "Nordheim Roastery",
      meta: "Roaster · Online now",
      description: "“Your Kirinyaga bag ships tomorrow — want us to grind for V60 or keep it whole bean?”",
      tags: ["Direct message", "Realtime", "Read receipts"],
      highlight: "2 unread",
    },
  },
};

export const getWelcomeContent = (slug: string | undefined): WelcomeContent => {
  if (slug && WELCOME_CONTENT[slug]) return WELCOME_CONTENT[slug];
  return {
    slug: "app",
    title: "CoffeeMart",
    tagline: "The specialty coffee marketplace.",
    description: "Sign in to unlock shops, roasters, beans and brewing tools.",
    bullets: ["Discover shops & roasters", "Shop specialty beans", "Track your brewing journey"],
    icon: Coffee,
    example: {
      kicker: "Example listing",
      name: "Nordheim Roastery",
      meta: "Oslo, Norway · Ships to EU & UK",
      description: "One of hundreds of roasters, shops and coffees waiting inside.",
      tags: ["Roasters", "Shops", "Coffees"],
      highlight: "★ 4.8",
    },
  };
};
