import { Link, useLocation } from "react-router-dom";
import { Coffee, Home, ShoppingBag, Store, BookOpen, Package, User, PenLine, GraduationCap, LogOut, Settings, Briefcase, BookMarked, MessageSquare, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();

  const mobileNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/shops", icon: Store, label: "Shops" },
    { path: "/roasters", icon: Package, label: "Roasters" },
    { path: "/coffee", icon: Coffee, label: "Coffee" },
    { path: "/guides", icon: BookOpen, label: "Guides" },
    { path: "/recipes", icon: BookOpen, label: "Recipes" },
    { path: "/equipment", icon: ShoppingBag, label: "Equipment" },
    { path: "/journal", icon: PenLine, label: "Journal" },
    { path: "/academy", icon: GraduationCap, label: "Academy" },
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/wiki", icon: BookMarked, label: "Wiki" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
    { path: "/library", icon: Library, label: "Library" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop/Tablet Top Bar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16">
        <div className="w-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CoffeeLovers</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="cursor-pointer hover:ring-2 ring-primary transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile Top Bar - Logo + Title on Left, Avatar on Right */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14">
        <div className="w-full px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Coffee className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">CoffeeLovers</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="cursor-pointer hover:ring-2 ring-primary transition-all h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-card">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Scrollable */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {mobileNavItems.map((item) => (
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

      {/* Spacers for fixed navigation */}
      <div className="h-14 md:h-16" />
      <div className="h-16 md:h-0" />
    </>
  );
};

export default Navigation;
