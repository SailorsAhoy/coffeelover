import { Link } from "react-router-dom";
import logo from "@/assets/coffeeplanets-logo.jpg";
import {
  Coffee, Home, Store, Package, BookOpen, ShoppingBag, PenLine, GraduationCap,
  Briefcase, BookMarked, MessageSquare, Library, Newspaper, Instagram, Facebook, Twitter, Youtube, Linkedin,
} from "lucide-react";

const menuLinks = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/news", icon: Newspaper, label: "News" },
  { path: "/shops", icon: Store, label: "Coffee Shops" },
  { path: "/roasters", icon: Package, label: "Roasters" },
  { path: "/coffee", icon: Coffee, label: "Coffee" },
  { path: "/guides", icon: BookOpen, label: "Brewing Guides" },
  { path: "/recipes", icon: BookOpen, label: "Recipes" },
  { path: "/equipment", icon: ShoppingBag, label: "Equipment" },
  { path: "/journal", icon: PenLine, label: "Brewing Journal" },
  { path: "/academy", icon: GraduationCap, label: "Barista Academy" },
  { path: "/jobs", icon: Briefcase, label: "Coffee Jobs" },
  { path: "/wiki", icon: BookMarked, label: "Coffee Wiki" },
  { path: "/forum", icon: MessageSquare, label: "Coffee Forum" },
  { path: "/library", icon: Library, label: "Coffee Library" },
];


const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "X" },
  { icon: Youtube, label: "YouTube" },
  { icon: Linkedin, label: "LinkedIn" },
];

const companyLinks = ["About Us", "FAQ", "Contact"];
const guideLinks = ["Roasters", "Shop Owners", "Affiliates", "Advertising"];

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-card mt-12 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CoffeePlanets logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-lg font-bold text-foreground">CoffeePlanets</span>
          </Link>

          <p className="text-sm text-muted-foreground">
            The specialty coffee marketplace and community.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">Explore</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {menuLinks.map((m) => (
              <li key={m.label}>
                <Link
                  to={m.path}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <m.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{m.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company + Guides */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">CoffeePlanets</h3>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Guides</h3>
            <ul className="space-y-2">
              {guideLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} CoffeePlanets. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
