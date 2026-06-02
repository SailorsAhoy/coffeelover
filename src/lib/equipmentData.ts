// Shared mock data for Machines & Accessories (brands, machines, accessories)
// Used by /equipment, /equipment/brand/:slug, /equipment/machine/:slug, /equipment/accessory/:slug

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  body: string;
}

export interface Guide {
  id: string;
  title: string;
  url: string; // internal route or external
}

export interface Brand {
  slug: string;
  name: string;
  country: string;
  founded: number;
  description: string;
  website: string;
  rating: number;
}

export interface Machine {
  slug: string;
  name: string;
  brandSlug: string;
  type: "Espresso Machine" | "Drip Coffee Maker" | "Pour Over" | "Moka Pot" | "Cold Brew" | "AeroPress" | "French Press";
  price: number;
  rating: number;
  description: string;
  specs: Record<string, string>;
  guides: Guide[];
  reviews: Review[];
}

export interface Accessory {
  slug: string;
  name: string;
  category: "Grinder" | "Accessories" | "Tools" | "Cleaning" | "Glassware";
  price: number;
  rating: number;
  description: string;
  specs: Record<string, string>;
  guides: Guide[];
  reviews: Review[];
}

const rv = (id: string, user: string, rating: number, date: string, body: string): Review => ({ id, user, rating, date, body });

export const brands: Brand[] = [
  { slug: "breville", name: "Breville", country: "Australia", founded: 1932, description: "Kitchen appliance maker known for prosumer espresso machines.", website: "https://breville.com", rating: 4.7 },
  { slug: "technivorm", name: "Technivorm", country: "Netherlands", founded: 1964, description: "Handcrafted Moccamaster drip brewers, SCA certified.", website: "https://moccamaster.com", rating: 4.9 },
  { slug: "hario", name: "Hario", country: "Japan", founded: 1921, description: "Heatproof glassware pioneer, creator of the V60.", website: "https://hario.com", rating: 4.8 },
  { slug: "rancilio", name: "Rancilio", country: "Italy", founded: 1927, description: "Commercial-grade espresso heritage; iconic Silvia home machine.", website: "https://rancilio.com", rating: 4.6 },
  { slug: "fellow", name: "Fellow", country: "USA", founded: 2013, description: "Design-led brewing tools, kettles and grinders.", website: "https://fellowproducts.com", rating: 4.7 },
  { slug: "baratza", name: "Baratza", country: "USA", founded: 1999, description: "Serviceable conical-burr grinders for home and cafe.", website: "https://baratza.com", rating: 4.7 },
];

export const machines: Machine[] = [
  {
    slug: "breville-barista-express",
    name: "Breville Barista Express", brandSlug: "breville", type: "Espresso Machine", price: 699.95, rating: 4.8,
    description: "All-in-one espresso with integrated conical burr grinder.",
    specs: { "Boiler": "Single, ThermoCoil", "Pump Pressure": "15 bar", "Water Tank": "2 L", "Portafilter": "54 mm", "Grinder": "Conical burr, 16 settings", "Weight": "10.5 kg" },
    guides: [{ id: "g1", title: "Dial in your espresso", url: "/guides" }, { id: "g2", title: "Milk steaming basics", url: "/guides" }],
    reviews: [rv("r1", "Alex", 5, "2025-09-12", "Best entry-level setup, grind to cup in one machine."), rv("r2", "Maria", 4, "2025-10-04", "Steam wand could be stronger, but pulls great shots.")],
  },
  {
    slug: "breville-dual-boiler",
    name: "Breville Dual Boiler", brandSlug: "breville", type: "Espresso Machine", price: 1599.95, rating: 4.9,
    description: "Prosumer dual boiler with PID and pre-infusion.",
    specs: { "Boiler": "Dual, stainless", "Pump Pressure": "9 bar OPV", "PID": "Yes", "Water Tank": "2.5 L", "Portafilter": "58 mm" },
    guides: [{ id: "g3", title: "Pressure profiling 101", url: "/guides" }],
    reviews: [rv("r3", "Tom", 5, "2025-08-22", "Cafe-quality at home, rock solid temp stability.")],
  },
  {
    slug: "technivorm-moccamaster-kbgv",
    name: "Technivorm Moccamaster KBGV", brandSlug: "technivorm", type: "Drip Coffee Maker", price: 349, rating: 4.9,
    description: "SCA-certified drip brewer, handmade in the Netherlands.",
    specs: { "Capacity": "1.25 L (10 cups)", "Brew Temp": "92–96 °C", "Brew Time": "4–6 min", "Warranty": "5 years" },
    guides: [{ id: "g4", title: "Drip ratios that work", url: "/guides" }],
    reviews: [rv("r4", "Jess", 5, "2025-07-15", "Set and forget. Clean, hot, fast.")],
  },
  {
    slug: "hario-v60-ceramic-02",
    name: "Hario V60 Ceramic 02", brandSlug: "hario", type: "Pour Over", price: 29.99, rating: 4.7,
    description: "Iconic 60° cone with spiral ribs for even extraction.",
    specs: { "Material": "Ceramic", "Size": "02 (1–4 cups)", "Filter": "V60 02 paper" },
    guides: [{ id: "g5", title: "V60 4:6 method", url: "/guides" }, { id: "g6", title: "Choosing a kettle", url: "/guides" }],
    reviews: [rv("r5", "Sam", 5, "2025-11-02", "Best $30 in coffee, full stop.")],
  },
  {
    slug: "hario-switch",
    name: "Hario V60 Switch", brandSlug: "hario", type: "Pour Over", price: 59.99, rating: 4.6,
    description: "Hybrid immersion + percolation dripper.",
    specs: { "Material": "Glass + silicone", "Size": "03 (1–4 cups)" },
    guides: [{ id: "g7", title: "Switch immersion recipe", url: "/guides" }],
    reviews: [rv("r6", "Lee", 4, "2025-06-18", "Forgiving for beginners, makes sweeter cups.")],
  },
  {
    slug: "rancilio-silvia",
    name: "Rancilio Silvia", brandSlug: "rancilio", type: "Espresso Machine", price: 899, rating: 4.7,
    description: "Classic single-boiler with commercial-grade brew group.",
    specs: { "Boiler": "Single, brass", "Group Head": "58 mm commercial", "Pump": "Vibratory 15 bar" },
    guides: [{ id: "g8", title: "Silvia temp surfing", url: "/guides" }],
    reviews: [rv("r7", "Karim", 5, "2025-05-30", "Mods her with a PID and she sings.")],
  },
];

export const accessories: Accessory[] = [
  {
    slug: "baratza-encore",
    name: "Baratza Encore", category: "Grinder", price: 169.99, rating: 4.7,
    description: "Entry conical-burr grinder, fully serviceable.",
    specs: { "Burr": "40 mm conical", "Steps": "40", "Hopper": "227 g" },
    guides: [{ id: "g9", title: "Grind size by method", url: "/guides" }],
    reviews: [rv("r8", "Pat", 5, "2025-09-01", "Workhorse for pour-over, runs forever.")],
  },
  {
    slug: "fellow-stagg-ekg",
    name: "Fellow Stagg EKG", category: "Accessories", price: 195, rating: 4.8,
    description: "Variable-temperature gooseneck kettle with PID.",
    specs: { "Capacity": "0.9 L", "Temp Range": "57–100 °C", "Hold": "60 min" },
    guides: [{ id: "g10", title: "Pour-over kettle technique", url: "/guides" }],
    reviews: [rv("r9", "Nina", 5, "2025-10-19", "Pour control is unmatched.")],
  },
  {
    slug: "acaia-pearl",
    name: "Acaia Pearl Scale", category: "Tools", price: 165, rating: 4.7,
    description: "Fast, precise brewing scale with app integration.",
    specs: { "Resolution": "0.1 g", "Capacity": "2 kg", "Battery": "USB-C rechargeable" },
    guides: [{ id: "g11", title: "Brew by ratio", url: "/guides" }],
    reviews: [rv("r10", "Owen", 4, "2025-08-08", "Responsive and accurate, premium price.")],
  },
  {
    slug: "milk-frother-pro",
    name: "Handheld Milk Frother Pro", category: "Accessories", price: 39.99, rating: 4.5,
    description: "Battery-powered wand for quick microfoam at home.",
    specs: { "Power": "AA batteries", "RPM": "19,000" },
    guides: [{ id: "g12", title: "Milk for latte art", url: "/guides" }],
    reviews: [rv("r11", "Riya", 4, "2025-07-03", "Great for the price, not a steam wand replacement.")],
  },
  {
    slug: "knock-box-classic",
    name: "Classic Knock Box", category: "Cleaning", price: 34.99, rating: 4.6,
    description: "Removable rubber-rimmed bar holds spent pucks quietly.",
    specs: { "Capacity": "~15 pucks", "Material": "Stainless + silicone" },
    guides: [{ id: "g13", title: "Clean espresso workflow", url: "/guides" }],
    reviews: [rv("r12", "Diego", 5, "2025-04-11", "Quiet, sturdy, dishwasher safe.")],
  },
  {
    slug: "double-wall-glasses",
    name: "Double-Wall Latte Glasses", category: "Glassware", price: 24.99, rating: 4.5,
    description: "Insulated borosilicate glasses, set of 2 (250 ml).",
    specs: { "Volume": "250 ml", "Material": "Borosilicate", "Set": "2 pcs" },
    guides: [{ id: "g14", title: "Serving temperatures", url: "/guides" }],
    reviews: [rv("r13", "Yui", 5, "2025-03-21", "Looks great, keeps drinks warm longer.")],
  },
];

export const findBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const findMachine = (slug: string) => machines.find((m) => m.slug === slug);
export const findAccessory = (slug: string) => accessories.find((a) => a.slug === slug);
export const machinesByBrand = (slug: string) => machines.filter((m) => m.brandSlug === slug);
