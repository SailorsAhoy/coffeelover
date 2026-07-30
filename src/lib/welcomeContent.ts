import { Store, Package, Coffee, BookOpen, ShoppingBag, PenLine, GraduationCap, Briefcase, BookMarked, MessageSquare, Library, type LucideIcon } from "lucide-react";

export interface WelcomeExample {
  /** Small label above the card, e.g. "Example roaster" */
  kicker: string;
  name: string;
  meta: string;
  /** Short teaser line */
  description: string;
  /** Longer "about" copy shown in the full example listing */
  about: string;
  tags: string[];
  /** Optional highlight, e.g. a price or rating */
  highlight?: string;
  /** Key/value spec rows */
  details: { label: string; value: string }[];
  /** Bulleted section under the details */
  section: { title: string; items: string[] };
  /** Sample review / comment */
  review: { author: string; rating: number; text: string };
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
      about:
        "A twelve-seat café just off the Vieux-Port, pouring a rotating single-origin filter alongside a classic espresso bar. The team roasts nothing in-house — instead they rotate guest roasters from across Europe every three weeks, and every bag on the shelf is available by the cup.",
      tags: ["Wi-Fi", "Outdoor seating", "V60", "Vegan milk", "Pet friendly"],
      highlight: "★ 4.8 (126 reviews)",
      details: [
        { label: "Address", value: "14 Rue Sainte, 13001 Marseille" },
        { label: "Hours today", value: "07:30 – 18:00" },
        { label: "Espresso machine", value: "La Marzocco Linea PB" },
        { label: "Grinders", value: "Mythos One · EK43" },
      ],
      section: {
        title: "On the bar this week",
        items: [
          "Guest filter: Colombia El Paraíso, Gesha, natural",
          "House espresso: Brazil / Ethiopia blend, 1:2 in 27 s",
          "Seasonal: iced cascara tonic",
        ],
      },
      review: {
        author: "Camille D.",
        rating: 5,
        text: "Best filter in the city, and the staff will happily talk you through every bag on the shelf.",
      },
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
      about:
        "Founded in 2014 in a converted boat shed on the Oslo fjord, Nordheim roasts exclusively for filter on a 15 kg Loring. They buy directly from eleven producing partners, publish what they pay, and ship within 48 hours of the roast date.",
      tags: ["Direct trade", "Light roast", "Subscriptions", "Loring S15"],
      highlight: "24 coffees listed",
      details: [
        { label: "Founded", value: "2014" },
        { label: "Roast profile", value: "Light / filter-forward" },
        { label: "Ships to", value: "EU, UK, Norway, Switzerland" },
        { label: "Lead time", value: "Roasted to order, 48h dispatch" },
      ],
      section: {
        title: "Featured coffees",
        items: [
          "Yirgacheffe Konga — washed heirloom — € 38.00 / kg",
          "Kirinyaga AA — washed SL28 — € 44.00 / kg",
          "El Paraíso Gesha — natural — € 96.00 / kg",
        ],
      },
      review: {
        author: "Jonas H.",
        rating: 5,
        text: "Consistently the cleanest cups I get shipped. The Kirinyaga is a yearly ritual.",
      },
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
      meta: "Nordheim Roastery · Ethiopia · Washed",
      description: "Jasmine, bergamot and stone fruit. Roasted for filter, shipped within 48h of roast.",
      about:
        "Grown at 1,950–2,100 masl around the Konga washing station in Gedeo, this lot is fully washed and dried on raised beds for 14 days. Delicate and tea-like, it rewards a slightly coarser grind and a gentle pour.",
      tags: ["Filter roast", "Floral", "Heirloom", "250 g / 1 kg", "In stock"],
      highlight: "€ 38.00 / kg",
      details: [
        { label: "Origin", value: "Gedeo, Ethiopia · 1,950–2,100 masl" },
        { label: "Variety / process", value: "Heirloom · Washed" },
        { label: "Roast level", value: "Light" },
        { label: "Ships to", value: "EU, UK, US" },
      ],
      section: {
        title: "Recommended brewing",
        items: [
          "V60: 15 g / 250 g water, 93 °C, 2:45 total",
          "AeroPress: 14 g / 200 g, inverted, 1:30 steep",
          "Batch brew: 60 g / L, medium grind",
        ],
      },
      review: {
        author: "Marta S.",
        rating: 5,
        text: "Bergamot right up front. Easily the most floral bag I've had this year.",
      },
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
      about:
        "A forgiving, repeatable recipe that works with almost any light-to-medium filter roast. Rinse the filter, level the bed, and keep the pours slow and centred — the goal is an even, flat bed at the end of the drawdown.",
      tags: ["1:16.6 ratio", "Medium-fine grind", "93 °C", "Hario V60-02"],
      highlight: "Beginner friendly",
      details: [
        { label: "Dose / water", value: "15 g coffee · 250 g water" },
        { label: "Temperature", value: "93 °C" },
        { label: "Grind", value: "Medium-fine (sea salt)" },
        { label: "Total time", value: "2:45 – 3:15" },
      ],
      section: {
        title: "The steps",
        items: [
          "Rinse filter, add grounds, level the bed",
          "Bloom with 45 g water, wait 45 s",
          "Pour to 150 g in slow spirals",
          "Final pour to 250 g, gentle swirl, drawdown",
        ],
      },
      review: {
        author: "Tom R.",
        rating: 4,
        text: "Followed it exactly and finally got a clean, sweet cup instead of the usual sour mess.",
      },
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
      meta: "Added by Martin · Cold · 5 minutes",
      description: "Double espresso poured over iced tonic water with an orange twist.",
      about:
        "The summer classic: bittersweet tonic, bright citrus and a fruity espresso. Use a light, fruity roast — chocolatey espresso tends to clash with the quinine.",
      tags: ["Cold", "Cocktail style", "Citrus", "Easy", "1 serving"],
      highlight: "★ 4.6 · 2.1k views",
      details: [
        { label: "Beverage type", value: "Cocktail style · non-alcoholic" },
        { label: "Temperature", value: "Cold" },
        { label: "Prep time", value: "5 minutes" },
        { label: "Servings", value: "1" },
      ],
      section: {
        title: "Ingredients & method",
        items: [
          "150 ml tonic water, 1 double espresso (36 g)",
          "Fill a tall glass with large ice cubes",
          "Pour tonic first, then espresso slowly over a spoon",
          "Finish with an orange twist",
        ],
      },
      review: {
        author: "Ana P.",
        rating: 5,
        text: "Pouring the espresso last keeps the layers — looks amazing and tastes even better.",
      },
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
      meta: "Comandante · Hand grinder · Stainless burrs",
      description: "Reference-grade manual grinder with repeatable click adjustment for filter and espresso.",
      about:
        "The benchmark hand grinder: high-nitrogen martensitic steel burrs, a click-stop adjustment you can count blind, and a build that survives years of travel. Capable of espresso, but happiest on filter.",
      tags: ["Manual", "Travel", "Filter & espresso", "40 mm burrs"],
      highlight: "€ 265.00",
      details: [
        { label: "Type", value: "Hand grinder" },
        { label: "Burrs", value: "39 mm conical, hardened steel" },
        { label: "Capacity", value: "40 g" },
        { label: "Adjustment", value: "30 clicks / rotation" },
      ],
      section: {
        title: "Suggested settings",
        items: ["Espresso: 8–12 clicks", "AeroPress: 15–18 clicks", "V60: 20–24 clicks", "French press: 28–32 clicks"],
      },
      review: {
        author: "Peter K.",
        rating: 5,
        text: "Six years of daily use, one burr clean a month, still grinds like new.",
      },
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
      meta: "Logged today · Session #48",
      description: "18.0 g in → 39.5 g out in 28 s. Blackcurrant and brown sugar, slightly tight.",
      about:
        "Every session records your dose, yield, time, temperature and grind setting, then plots them so you can see exactly which change made the cup better.",
      tags: ["Espresso", "TDS 9.4%", "Score 8.5", "Setting 2.4"],
      highlight: "Extraction yield 20.7%",
      details: [
        { label: "Dose → yield", value: "18.0 g → 39.5 g (1:2.2)" },
        { label: "Time / temp", value: "28 s · 93.5 °C" },
        { label: "Grinder", value: "Niche Zero, setting 2.4" },
        { label: "Score", value: "8.5 / 10" },
      ],
      section: {
        title: "Tasting notes",
        items: ["Aroma: blackcurrant, tomato leaf", "Body: syrupy", "Finish: brown sugar", "Next: grind one step coarser"],
      },
      review: {
        author: "Your note",
        rating: 4,
        text: "Slightly tight — pull again at 27 s and see if the acidity opens up.",
      },
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
      about:
        "Taught by a two-time national latte art finalist, this course starts with milk chemistry and steam wand position, then builds pattern by pattern with slow-motion pour breakdowns you can replay at the machine.",
      tags: ["Video", "Downloads", "Certificate", "Beginner"],
      highlight: "★ 4.9 · 840 students",
      details: [
        { label: "Instructor", value: "Elena Rossi, SCA AST" },
        { label: "Format", value: "8 video lessons + PDFs" },
        { label: "Duration", value: "2h 40m" },
        { label: "Certificate", value: "Yes, on completion" },
      ],
      section: {
        title: "Curriculum",
        items: ["1. Milk science & texture", "2. Steam wand technique", "3. The heart", "4. The rosetta", "5. The tulip"],
      },
      review: {
        author: "Sofia L.",
        rating: 5,
        text: "The slow-motion pours made it click. First clean rosetta after lesson four.",
      },
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
      meta: "Copo Café · Lisbon, Portugal · On site",
      description: "Lead a team of four, run the bar programme and manage espresso calibration.",
      about:
        "We are a two-site specialty café looking for a head barista to own the bar programme: daily calibration, guest roaster selection, staff training and service standards across both locations.",
      tags: ["Full time", "2+ years", "SCA welcome", "On site"],
      highlight: "€ 1,600–1,900 / month",
      details: [
        { label: "Contract", value: "Full time, permanent" },
        { label: "Experience", value: "2+ years specialty" },
        { label: "Languages", value: "Portuguese or English" },
        { label: "Start", value: "As soon as possible" },
      ],
      section: {
        title: "What you'll do",
        items: ["Daily espresso calibration", "Train and schedule a team of four", "Select guest roasters", "Own quality standards"],
      },
      review: {
        author: "Employer note",
        rating: 5,
        text: "Applications reviewed weekly — a short intro message beats a formal CV.",
      },
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
      meta: "Processing · 6 min read · Community edited",
      description: "Whole cherries dried in the sun, producing fruity, wine-like and full-bodied cups.",
      about:
        "In natural processing the whole cherry is dried intact, so sugars and fruit acids migrate into the seed during a 15–25 day dry. It is the oldest processing method and the most weather-dependent: too slow and the lot ferments, too fast and it dries unevenly.",
      tags: ["Fruity", "Sweet", "Full body", "Ethiopia", "Brazil"],
      highlight: "Beginner to expert",
      details: [
        { label: "Also known as", value: "Dry process, unwashed" },
        { label: "Drying time", value: "15–25 days on raised beds" },
        { label: "Typical flavours", value: "Berry, wine, tropical fruit" },
        { label: "Common origins", value: "Ethiopia, Brazil, Yemen" },
      ],
      section: {
        title: "In this article",
        items: ["History and origins", "Step-by-step process", "Defect risks and control", "How it tastes vs washed"],
      },
      review: {
        author: "Community",
        rating: 5,
        text: "Last edited 3 weeks ago · 14 contributors",
      },
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
      meta: "Espresso · 34 replies · Last reply 2h ago",
      description: "Distribution, puck prep and basket condition — the community troubleshoots step by step.",
      about:
        "Original post: “Sprayed shots and a soupy puck on a 18 g VST, 9 bar, 27 s. Grinder is a Niche. Beans are two weeks off roast.” What followed is the most useful puck-prep thread on the forum.",
      tags: ["Espresso", "Troubleshooting", "Hot topic", "Puck prep"],
      highlight: "34 replies · 1.8k views",
      details: [
        { label: "Category", value: "Espresso" },
        { label: "Started by", value: "@brewbird" },
        { label: "Replies", value: "34" },
        { label: "Status", value: "Solved" },
      ],
      section: {
        title: "Top answers",
        items: [
          "WDT the basket before tamping — fixes most channeling",
          "Check the basket isn't overdosed for its rated weight",
          "Level tamp matters more than tamp pressure",
        ],
      },
      review: {
        author: "@lucasgrinds",
        rating: 5,
        text: "WDT plus a 15 g dose in the 18 g basket and the spraying stopped completely.",
      },
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
      meta: "James Hoffmann · English · 2018",
      description: "Origins, varieties and brewing, mapped country by country — the modern reference.",
      about:
        "Part atlas, part brewing manual: the first half covers growing, processing and brewing fundamentals, the second walks through every major producing country with maps, altitudes and harvest calendars.",
      tags: ["Reference", "Origins", "Brewing", "Illustrated"],
      highlight: "★ 4.8 · 312 ratings",
      details: [
        { label: "Author", value: "James Hoffmann" },
        { label: "Category", value: "Reference / origins" },
        { label: "Language", value: "English" },
        { label: "Pages", value: "256" },
      ],
      section: {
        title: "What's inside",
        items: ["Growing and processing basics", "Brewing method walkthroughs", "Country-by-country origin maps"],
      },
      review: {
        author: "Nina B.",
        rating: 5,
        text: "The one book I'd give to anyone who just bought their first grinder.",
      },
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
      meta: "Roaster · Online now · 2 unread",
      description: "“Your Kirinyaga bag ships tomorrow — grind for V60 or keep it whole bean?”",
      about:
        "Message any shop, roaster or member directly. Threads are realtime, unread counts appear on the navbar bell, and they clear the moment you open the conversation.",
      tags: ["Direct message", "Realtime", "Read receipts", "Verified roaster"],
      highlight: "2 unread",
      details: [
        { label: "Thread with", value: "Nordheim Roastery" },
        { label: "Status", value: "Online now" },
        { label: "Started", value: "3 days ago" },
        { label: "Messages", value: "12" },
      ],
      section: {
        title: "Recent messages",
        items: [
          "You: Any Kirinyaga left from the last roast?",
          "Nordheim: Two bags — reserved one for you.",
          "Nordheim: Ships tomorrow. Whole bean or ground?",
        ],
      },
      review: {
        author: "Nordheim Roastery",
        rating: 5,
        text: "Typically replies within an hour on weekdays.",
      },
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
      about:
        "Every listing includes the full story: photos, contact, opening hours, products, brewing guidance and community reviews.",
      tags: ["Roasters", "Shops", "Coffees", "Guides"],
      highlight: "★ 4.8",
      details: [
        { label: "Type", value: "Roastery" },
        { label: "Location", value: "Oslo, Norway" },
        { label: "Ships to", value: "EU & UK" },
        { label: "Listings", value: "24 coffees" },
      ],
      section: {
        title: "Inside CoffeeMart",
        items: ["Shops and roasters near you", "Specialty beans with filters", "Guides, recipes and courses"],
      },
      review: {
        author: "Jonas H.",
        rating: 5,
        text: "Everything I used to keep in five bookmarks, in one place.",
      },
    },
  };
};
