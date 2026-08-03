import { NavLink } from "@/components/NavLink";
import { Coffee, Store, Package, BookOpen, ShoppingBag, PenLine, GraduationCap, User, Briefcase, BookMarked, MessageSquare, Library, ChevronLeft, ChevronRight, Users, MessageCircle, Settings, LayoutDashboard, Newspaper } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useT } from "@/contexts/I18nContext";
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
  { path: "/dashboard", icon: LayoutDashboard, key: "nav.dashboard" },
  { path: "/news", icon: Newspaper, key: "nav.newsfeed" },
  { path: "/shops", icon: Store, key: "nav.shops" },
  { path: "/roasters", icon: Package, key: "nav.roasters" },
  { path: "/coffee", icon: Coffee, key: "nav.coffee" },
  { path: "/guides", icon: BookOpen, key: "nav.guides" },
  { path: "/recipes", icon: BookOpen, key: "nav.recipes" },
  { path: "/equipment", icon: ShoppingBag, key: "nav.equipment" },
  { path: "/journal", icon: PenLine, key: "nav.journal" },
  { path: "/academy", icon: GraduationCap, key: "nav.academy" },
  { path: "/jobs", icon: Briefcase, key: "nav.jobs" },
  { path: "/wiki", icon: BookMarked, key: "nav.wiki" },
  { path: "/forum", icon: MessageSquare, key: "nav.forum" },
  { path: "/library", icon: Library, key: "nav.library" },
  { path: "/social", icon: Users, key: "nav.social" },
  { path: "/messaging", icon: MessageCircle, key: "nav.messaging" },
  { path: "/settings", icon: Settings, key: "nav.settings" },
  { path: "/profile", icon: User, key: "nav.profile" },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const t = useT();

  return (
    <Sidebar collapsible="icon" className="border-r border-border flex flex-col">
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="h-16" />
              {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={t(item.key)}>
                    <NavLink
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-accent"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {open && <span className="font-medium">{t(item.key)}</span>}
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
              <span className="text-sm font-medium">{t("nav.toggle")}</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4 mx-auto" />
          )}
        </SidebarTrigger>
      </div>
    </Sidebar>
  );
}
