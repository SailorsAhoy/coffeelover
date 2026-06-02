import { NavLink } from "@/components/NavLink";
import { Coffee, Store, Package, BookOpen, ShoppingBag, PenLine, GraduationCap, User, Briefcase, BookMarked, MessageSquare, Library, ChevronLeft, ChevronRight, Users, MessageCircle, Settings, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
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
  { path: "/social", icon: Users, label: "Social Connect" },
  { path: "/messaging", icon: MessageCircle, label: "Messaging" },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border flex flex-col">
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="h-16" />
              {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {open && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="border-t border-border p-2">
        <SidebarTrigger className="flex items-center gap-2 hover:bg-accent px-3 py-2 rounded-lg transition-colors w-full">
          {open ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Toggle</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4 mx-auto" />
          )}
        </SidebarTrigger>
      </div>
    </Sidebar>
  );
}
