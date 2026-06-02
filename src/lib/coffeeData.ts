// Shared coffee product catalog. Used by /coffee and /coffee/:id

export interface CoffeeReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  body: string;
}

export interface CoffeeGuideRef {
  id: string;
  title: string;
  url: string;
}

export interface CoffeeItem {
  id: number;
  slug: string;
  name: string;
  roaster: string;
  type: "Arabica" | "Robusta" | "Blend";
  roast: "Light" | "Medium" | "Dark";
  origin: string;
  region?: string;
  altitude?: string;
  process?: "Washed" | "Natural" | "Honey" | "Anaerobic";
  variety?: string;
  price: number;
  rating: number;
  tastingNotes: string[];
  description: string;
  brewRecommendation: string;
  guides: CoffeeGuideRef[];
  reviews: CoffeeReview[];
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const rv = (id: string, user: string, rating: number, date: string, body: string): CoffeeReview => ({ id, user, rating, date, body });

const guidesFor = (roast: string): CoffeeGuideRef[] => {
  if (roast === "Light") {
    return [
      { id: "g-pourover", title: "V60 4:6 method", url: "/guides" },
      { id: "g-aeropress", title: "AeroPress for light roasts", url: "/guides" },
    ];
  }
  if (roast === "Medium") {
    return [
      { id: "g-drip", title: "Drip ratios that work", url: "/guides" },
      { id: "g-pourover", title: "Pour over technique", url: "/guides" },
    ];
  }
  return [
    { id: "g-espresso", title: "Dial in your espresso", url: "/guides" },
    { id: "g-moka", title: "Moka pot fundamentals", url: "/guides" },
  ];
};

const defaultReviews = (rating: number): CoffeeReview[] => [
  rv("rv1", "Sarah M.", Math.min(5, Math.round(rating)), "2 weeks ago", "Excellent cup, exactly what I was hoping for. Will reorder."),
  rv("rv2", "James K.", Math.max(3, Math.round(rating) - 1), "1 month ago", "Great quality. Sweetness comes through with a slightly coarser grind."),
  rv("rv3", "Maria L.", Math.round(rating), "1 month ago", "Lovely complexity. Pair with a slow pour-over for the best experience."),
];

type Seed = Omit<CoffeeItem, "slug" | "tastingNotes" | "description" | "brewRecommendation" | "guides" | "reviews" | "region" | "altitude" | "process" | "variety"> & {
  notes: string[]; region?: string; altitude?: string; process?: CoffeeItem["process"]; variety?: string;
};

const seeds: Seed[] = [
  { id: 1, name: "Ethiopian Yirgacheffe", roaster: "Heritage Roasters", type: "Arabica", roast: "Light", origin: "Ethiopia", price: 24.99, rating: 4.9, notes: ["Floral", "Citrus", "Bergamot"], region: "Yirgacheffe", altitude: "1,700–2,200 m", process: "Washed", variety: "Heirloom" },
  { id: 4, name: "Kenya AA Nyeri", roaster: "Heritage Roasters", type: "Arabica", roast: "Medium", origin: "Kenya", price: 27.5, rating: 4.85, notes: ["Blackcurrant", "Tomato", "Brown sugar"], region: "Nyeri", altitude: "1,600–1,900 m", process: "Washed", variety: "SL28" },
  { id: 13, name: "Heritage Dark Roast", roaster: "Heritage Roasters", type: "Blend", roast: "Dark", origin: "Brazil", price: 15.5, rating: 4.4, notes: ["Cocoa", "Toasted nut", "Caramel"], process: "Natural" },
  { id: 14, name: "Yirgacheffe Reserve Micro-lot", roaster: "Heritage Roasters", type: "Arabica", roast: "Light", origin: "Ethiopia", price: 42.0, rating: 4.95, notes: ["Jasmine", "Peach", "Black tea"], region: "Yirgacheffe", altitude: "2,100 m", process: "Washed" },

  { id: 2, name: "Colombian Supremo", roaster: "Modern Bean Co.", type: "Arabica", roast: "Medium", origin: "Colombia", price: 19.99, rating: 4.7, notes: ["Milk chocolate", "Hazelnut", "Apple"], region: "Huila", process: "Washed" },
  { id: 15, name: "Modern Breakfast Blend", roaster: "Modern Bean Co.", type: "Blend", roast: "Medium", origin: "Colombia", price: 14.0, rating: 4.3, notes: ["Caramel", "Almond"], process: "Washed" },
  { id: 16, name: "Huila Dark Reserve", roaster: "Modern Bean Co.", type: "Arabica", roast: "Dark", origin: "Colombia", price: 28.5, rating: 4.6, notes: ["Dark chocolate", "Molasses"], region: "Huila", process: "Natural" },
  { id: 17, name: "Narino Light Lot", roaster: "Modern Bean Co.", type: "Arabica", roast: "Light", origin: "Colombia", price: 33.0, rating: 4.8, notes: ["Pineapple", "Lime", "Honey"], region: "Nariño", process: "Honey" },

  { id: 3, name: "Sumatra Mandheling", roaster: "Altitude Coffee", type: "Arabica", roast: "Dark", origin: "Indonesia", price: 22.99, rating: 4.8, notes: ["Earthy", "Cedar", "Dark cocoa"], region: "Sumatra", process: "Natural" },
  { id: 18, name: "Sulawesi Toraja", roaster: "Altitude Coffee", type: "Arabica", roast: "Medium", origin: "Indonesia", price: 26.0, rating: 4.7, notes: ["Spiced", "Brown sugar", "Cedar"], region: "Toraja", process: "Washed" },
  { id: 19, name: "Altitude Espresso Bold", roaster: "Altitude Coffee", type: "Blend", roast: "Dark", origin: "Indonesia", price: 19.5, rating: 4.5, notes: ["Bittersweet chocolate", "Tobacco"], process: "Natural" },

  { id: 5, name: "Guatemala Antigua", roaster: "Brooklyn Roast & Shop", type: "Arabica", roast: "Medium", origin: "Guatemala", price: 21.0, rating: 4.6, notes: ["Cocoa", "Orange", "Toffee"], region: "Antigua", process: "Washed" },
  { id: 20, name: "Brooklyn House Blend", roaster: "Brooklyn Roast & Shop", type: "Blend", roast: "Medium", origin: "Guatemala", price: 16.0, rating: 4.4, notes: ["Chocolate", "Walnut"], process: "Washed" },
  { id: 21, name: "Honduras Cup of Excellence", roaster: "Brooklyn Roast & Shop", type: "Arabica", roast: "Light", origin: "Honduras", price: 38.0, rating: 4.9, notes: ["Red apple", "Honey", "Floral"], process: "Washed" },

  { id: 6, name: "Brazilian Santos", roaster: "Café del Sol", type: "Arabica", roast: "Dark", origin: "Brazil", price: 16.5, rating: 4.3, notes: ["Peanut", "Cocoa"], process: "Natural" },
  { id: 22, name: "Sol Mediterráneo Blend", roaster: "Café del Sol", type: "Blend", roast: "Medium", origin: "Brazil", price: 13.5, rating: 4.2, notes: ["Almond", "Caramel"], process: "Natural" },
  { id: 23, name: "Brazil Cerrado Natural", roaster: "Café del Sol", type: "Arabica", roast: "Light", origin: "Brazil", price: 22.0, rating: 4.5, notes: ["Strawberry", "Brown sugar"], region: "Cerrado", process: "Natural" },

  { id: 7, name: "Costa Rica Tarrazú", roaster: "Andes Origin", type: "Arabica", roast: "Light", origin: "Costa Rica", price: 23.0, rating: 4.7, notes: ["Honey", "Citrus", "Almond"], region: "Tarrazú", process: "Honey" },
  { id: 24, name: "Peru Chanchamayo", roaster: "Andes Origin", type: "Arabica", roast: "Medium", origin: "Peru", price: 21.5, rating: 4.6, notes: ["Cocoa", "Hazelnut"], region: "Chanchamayo", process: "Washed" },
  { id: 25, name: "Andes Dark Reserve", roaster: "Andes Origin", type: "Arabica", roast: "Dark", origin: "Peru", price: 25.0, rating: 4.5, notes: ["Bittersweet chocolate", "Smoke"], process: "Washed" },
  { id: 26, name: "Geisha Micro-lot", roaster: "Andes Origin", type: "Arabica", roast: "Light", origin: "Panama", price: 65.0, rating: 5.0, notes: ["Jasmine", "Bergamot", "Tropical fruit"], process: "Washed", variety: "Geisha" },

  { id: 8, name: "Vietnamese Robusta", roaster: "Saigon Roast House", type: "Robusta", roast: "Dark", origin: "Vietnam", price: 14.99, rating: 4.2, notes: ["Dark chocolate", "Earth", "Nut"], process: "Natural" },
  { id: 27, name: "Saigon Phin Blend", roaster: "Saigon Roast House", type: "Blend", roast: "Dark", origin: "Vietnam", price: 12.5, rating: 4.1, notes: ["Cocoa", "Caramel"], process: "Natural" },
  { id: 28, name: "Dalat Arabica Light", roaster: "Saigon Roast House", type: "Arabica", roast: "Light", origin: "Vietnam", price: 19.0, rating: 4.4, notes: ["Stone fruit", "Honey"], region: "Dalat", process: "Washed" },

  { id: 9, name: "House Espresso Blend", roaster: "Roma Espresso Lab", type: "Blend", roast: "Dark", origin: "Italy", price: 18.0, rating: 4.5, notes: ["Dark chocolate", "Cherry", "Hazelnut"], process: "Natural" },
  { id: 29, name: "Roma Crema Classico", roaster: "Roma Espresso Lab", type: "Blend", roast: "Medium", origin: "Italy", price: 15.0, rating: 4.3, notes: ["Toffee", "Almond"], process: "Washed" },
  { id: 30, name: "Espresso Riserva Nera", roaster: "Roma Espresso Lab", type: "Blend", roast: "Dark", origin: "Italy", price: 29.0, rating: 4.7, notes: ["Dark cocoa", "Spice", "Molasses"], process: "Natural" },

  { id: 10, name: "Berlin Ferment Lot #4", roaster: "Berlin Bean Lab", type: "Arabica", roast: "Light", origin: "Ethiopia", price: 32.0, rating: 4.9, notes: ["Wine", "Berry", "Tropical"], process: "Anaerobic" },
  { id: 31, name: "Anaerobic Natural Colombia", roaster: "Berlin Bean Lab", type: "Arabica", roast: "Light", origin: "Colombia", price: 36.0, rating: 4.85, notes: ["Boozy", "Strawberry", "Rum"], process: "Anaerobic" },
  { id: 32, name: "Lab Espresso Project #2", roaster: "Berlin Bean Lab", type: "Blend", roast: "Medium", origin: "Brazil", price: 24.0, rating: 4.6, notes: ["Cocoa", "Cherry"], process: "Honey" },

  { id: 11, name: "Highland Breakfast", roaster: "Highland Roasters", type: "Blend", roast: "Medium", origin: "Scotland", price: 17.5, rating: 4.4, notes: ["Malt", "Cocoa", "Hazelnut"], process: "Washed" },
  { id: 33, name: "Highland Single Malt Dark", roaster: "Highland Roasters", type: "Arabica", roast: "Dark", origin: "Kenya", price: 23.0, rating: 4.5, notes: ["Smoky", "Dark fruit"], process: "Washed" },
  { id: 34, name: "Edinburgh Espresso", roaster: "Highland Roasters", type: "Blend", roast: "Dark", origin: "Brazil", price: 19.0, rating: 4.3, notes: ["Cocoa", "Nut"], process: "Natural" },

  { id: 12, name: "Sakura Single Origin", roaster: "Sakura Coffee Works", type: "Arabica", roast: "Light", origin: "Japan", price: 34.0, rating: 4.95, notes: ["Cherry blossom", "Honey", "Tea"], process: "Washed" },
  { id: 35, name: "Kyoto Cold Brew Blend", roaster: "Sakura Coffee Works", type: "Blend", roast: "Medium", origin: "Japan", price: 28.0, rating: 4.7, notes: ["Chocolate", "Plum"], process: "Washed" },
  { id: 36, name: "Hokkaido Dark Hand-Roast", roaster: "Sakura Coffee Works", type: "Arabica", roast: "Dark", origin: "Japan", price: 41.0, rating: 4.8, notes: ["Toasted bread", "Cocoa", "Smoke"], process: "Natural" },
];

export const coffees: CoffeeItem[] = seeds.map((s) => ({
  id: s.id,
  slug: `${s.id}-${slugify(s.name)}`,
  name: s.name,
  roaster: s.roaster,
  type: s.type,
  roast: s.roast,
  origin: s.origin,
  region: s.region,
  altitude: s.altitude,
  process: s.process,
  variety: s.variety,
  price: s.price,
  rating: s.rating,
  tastingNotes: s.notes,
  description: `${s.name} from ${s.roaster}. A ${s.roast.toLowerCase()}-roast ${s.type.toLowerCase()} from ${s.region ? s.region + ", " : ""}${s.origin}${s.process ? `, processed using the ${s.process.toLowerCase()} method` : ""}.`,
  brewRecommendation:
    s.roast === "Light"
      ? "Best as pour-over or AeroPress. Use 200°F water, 1:16 ratio, medium-fine grind."
      : s.roast === "Medium"
      ? "Versatile for drip and pour-over. 196°F water, 1:16 ratio, medium grind."
      : "Excellent for espresso and moka pot. 9 bar, 1:2 ratio, fine grind.",
  guides: guidesFor(s.roast),
  reviews: defaultReviews(s.rating),
}));

export const findCoffee = (idOrSlug: string) => {
  const byId = coffees.find((c) => String(c.id) === idOrSlug);
  if (byId) return byId;
  return coffees.find((c) => c.slug === idOrSlug);
};

export const relatedCoffees = (c: CoffeeItem, n = 3) =>
  coffees
    .filter((o) => o.id !== c.id && (o.roaster === c.roaster || o.origin === c.origin || o.roast === c.roast))
    .slice(0, n);
