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
    tagline: "Discover specialty coffee shops near you",
    description: "Browse curated specialty coffee shops with photos, opening hours, amenities and reviews from fellow enthusiasts.",
    bullets: [
      "Filter by location, amenities and shop type",
      "Read reviews and see live opening status",
      "Save favorites and plan your coffee tours",
    ],
    icon: Store,
  },
  roasters: {
    slug: "roasters",
    title: "Roasters",
    tagline: "Explore premium roasters and their beans",
    description: "Meet independent roasters, learn their stories, browse their coffees and shop directly from their storefronts.",
    bullets: [
      "Follow your favorite roasters",
      "See sourcing, roast profiles and shipping info",
      "Claim ownership if you are a roaster",
    ],
    icon: Package,
  },
  coffee: {
    slug: "coffee",
    title: "Coffee Selection",
    tagline: "Browse and shop specialty coffee beans",
    description: "Filter thousands of beans by origin, process, variety, roast level and price. Currency-aware and region-aware.",
    bullets: [
      "Filter by origin, variety, process, roast",
      "Availability and shipping regions",
      "Save products to your brewing journal",
    ],
    icon: Coffee,
  },
  guides: {
    slug: "guides",
    title: "Brewing Guides",
    tagline: "Master every brewing method",
    description: "Step-by-step guides for espresso, pour over, French press, AeroPress, cold brew and more.",
    bullets: ["Recommended ratios and grind sizes", "Timing and temperature", "Troubleshooting tips"],
    icon: BookOpen,
  },
  recipes: {
    slug: "recipes",
    title: "Recipes",
    tagline: "Delicious coffee drink recipes",
    description: "From classic espresso drinks to creative signature recipes shared by the community.",
    bullets: ["Full ingredient lists", "Prep time and servings", "Community favorites"],
    icon: BookOpen,
  },
  equipment: {
    slug: "equipment",
    title: "Equipment",
    tagline: "Find the perfect gear",
    description: "Browse espresso machines, grinders, brewers and accessories from top manufacturers.",
    bullets: ["Filter by brand and type", "Compare specs and prices", "Read owner reviews"],
    icon: ShoppingBag,
  },
  journal: {
    slug: "journal",
    title: "Brewing Journal",
    tagline: "Track every cup you brew",
    description: "Log your coffee products, equipment and brew sessions to dial in the perfect cup.",
    bullets: ["Track dose, yield, time, TDS", "Score aroma, sweetness, body", "Build your personal coffee library"],
    icon: PenLine,
  },
  academy: {
    slug: "academy",
    title: "Barista Academy",
    tagline: "Learn from expert instructors",
    description: "Courses covering everything from basic technique to advanced barista skills, with progress tracking.",
    bullets: ["Video lessons and materials", "Progress tracking", "Certificates on completion"],
    icon: GraduationCap,
  },
  jobs: {
    slug: "jobs",
    title: "Coffee Jobs",
    tagline: "Careers in coffee",
    description: "Find and post barista, roaster, buyer and management roles across the specialty coffee industry.",
    bullets: ["Filter by location and role", "Apply directly", "Post openings as a business"],
    icon: Briefcase,
  },
  wiki: {
    slug: "wiki",
    title: "Coffee Wiki",
    tagline: "The coffee knowledge base",
    description: "Explore varieties, origins, processing methods and brewing techniques in a searchable wiki.",
    bullets: ["Deep-dive articles", "Community contributions", "Beginner to expert"],
    icon: BookMarked,
  },
  forum: {
    slug: "forum",
    title: "Coffee Forum",
    tagline: "Talk coffee with the community",
    description: "Join discussions about brewing, gear, beans and everything in between.",
    bullets: ["Ask and answer questions", "Share your setups", "Follow experts"],
    icon: MessageSquare,
  },
  library: {
    slug: "library",
    title: "Coffee Library",
    tagline: "The best coffee books",
    description: "Curated books about coffee, brewing, roasting, sourcing and the culture around it.",
    bullets: ["Reviews and recommendations", "Categorized by topic", "Community ratings"],
    icon: Library,
  },
};

export const getWelcomeContent = (slug: string | undefined): WelcomeContent => {
  if (slug && WELCOME_CONTENT[slug]) return WELCOME_CONTENT[slug];
  return {
    slug: "app",
    title: "CoffeeMart",
    tagline: "The specialty coffee marketplace",
    description: "Sign in to unlock shops, roasters, beans, brewing guides and more.",
    bullets: ["Discover and review coffee shops", "Shop beans from top roasters", "Track your brewing journey"],
    icon: Coffee,
  };
};
