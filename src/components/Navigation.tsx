import { Link, useLocation } from "react-router-dom";
import { Coffee, Home, ShoppingBag, Store, BookOpen, Package, User, PenLine, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/shops", icon: Store, label: "Shops" },
    { path: "/roasters", icon: Package, label: "Roasters" },
    { path: "/coffee", icon: Coffee, label: "Coffee" },
    { path: "/guides", icon: BookOpen, label: "Guides" },
    { path: "/recipes", icon: BookOpen, label: "Recipes" },
    { path: "/equipment", icon: ShoppingBag, label: "Equipment" },
    { path: "/journal", icon: PenLine, label: "Journal" },
    { path: "/academy", icon: GraduationCap, label: "Academy" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CoffeeMart</span>
            </Link>
            <div className="flex gap-6">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Scrollable */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors whitespace-nowrap",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navigation;
