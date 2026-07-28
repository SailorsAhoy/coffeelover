import { Store, Package, Coffee, BookOpen, ShoppingBag, PenLine, GraduationCap, Briefcase, BookMarked, MessageSquare, Library, type LucideIcon } from "lucide-react";

export interface WelcomeContent {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
}

export const WELCOME_CONTENT: Record<string, WelcomeContent> = {
  shops: {
    slug: "shops",
    title: "Coffee Shops",
    tagline: "Specialty coffee, near you.",
    description: "Discover curated cafés with photos, hours and reviews.",
    bullets: ["Filter by location & amenities", "Live open/closed status", "Save favorites"],
    icon: Store,
  },
  roasters: {
    slug: "roasters",
    title: "Roasters",
    tagline: "Meet the makers behind the beans.",
    description: "Follow independent roasters and shop their coffees direct.",
    bullets: ["Roaster stories & sourcing", "Shipping regions at a glance", "Claim your roastery"],
    icon: Package,
  },
  coffee: {
    slug: "coffee",
    title: "Coffee Beans",
    tagline: "Find your next favorite bag.",
    description: "Search specialty beans by origin, process, roast and price.",
    bullets: ["Origin, variety & process filters", "Currency & region aware", "Add to your brewing journal"],
    icon: Coffee,
  },
  guides: {
    slug: "guides",
    title: "Brewing Guides",
    tagline: "Master every method.",
    description: "Step-by-step recipes for espresso, pour over, AeroPress and more.",
    bullets: ["Ratios & grind sizes", "Timing & temperature", "Troubleshooting tips"],
    icon: BookOpen,
  },
  recipes: {
    slug: "recipes",
    title: "Recipes",
    tagline: "Delicious coffee drinks.",
    description: "Classic and creative recipes shared by the community.",
    bullets: ["Full ingredient lists", "Prep time & servings", "Community favorites"],
    icon: BookOpen,
  },
  equipment: {
    slug: "equipment",
    title: "Equipment",
    tagline: "Gear up for great coffee.",
    description: "Machines, grinders, brewers and accessories from top brands.",
    bullets: ["Filter by brand & type", "Compare specs", "Owner reviews"],
    icon: ShoppingBag,
  },
  journal: {
    slug: "journal",
    title: "Brewing Journal",
    tagline: "Track every cup.",
    description: "Log products, gear and brew sessions to dial in your perfect cup.",
    bullets: ["Dose, yield, time & TDS", "Score aroma & body", "Your personal coffee history"],
    icon: PenLine,
  },
  academy: {
    slug: "academy",
    title: "Barista Academy",
    tagline: "Learn from the pros.",
    description: "Courses from first pull to advanced barista technique.",
    bullets: ["Video lessons & materials", "Progress tracking", "Certificates on completion"],
    icon: GraduationCap,
  },
  jobs: {
    slug: "jobs",
    title: "Coffee Jobs",
    tagline: "Careers in specialty coffee.",
    description: "Barista, roaster, buyer and management roles worldwide.",
    bullets: ["Filter by role & location", "Apply directly", "Post openings as a business"],
    icon: Briefcase,
  },
  wiki: {
    slug: "wiki",
    title: "Coffee Wiki",
    tagline: "The coffee knowledge base.",
    description: "Varieties, origins, processes and techniques — all searchable.",
    bullets: ["Deep-dive articles", "Community edits", "Beginner to expert"],
    icon: BookMarked,
  },
  forum: {
    slug: "forum",
    title: "Coffee Forum",
    tagline: "Talk coffee with the community.",
    description: "Discuss brewing, gear, beans and everything in between.",
    bullets: ["Ask & answer questions", "Share your setup", "Follow experts"],
    icon: MessageSquare,
  },
  library: {
    slug: "library",
    title: "Coffee Library",
    tagline: "The best coffee reads.",
    description: "Curated books on coffee, brewing, roasting and culture.",
    bullets: ["Reviews & recommendations", "Browse by topic", "Community ratings"],
    icon: Library,
  },
  messages: {
    slug: "messages",
    title: "Messages",
    tagline: "Chat with the coffee community.",
    description: "Direct messages with roasters, shops and fellow enthusiasts.",
    bullets: ["Real-time chat", "Follow & friend requests", "Notification bell built in"],
    icon: MessageSquare,
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
  };
};
