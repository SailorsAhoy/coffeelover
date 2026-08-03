import logo from "@/assets/coffeeplanets-logo.jpg";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Coffee, Home, ShoppingBag, Store, BookOpen, Package, User, PenLine, GraduationCap, LogOut, LogIn, Settings, Briefcase, BookMarked, MessageSquare, Library, Users, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NotificationBell from "@/components/notifications/NotificationBell";
import { listMyChats } from "@/lib/messaging";
import { supabase } from "@/integrations/supabase/client";
import LanguageSelector from "@/components/LanguageSelector";
import { useT } from "@/contexts/I18nContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, profile, hasRole, signOut, user } = useCurrentUser();
  const t = useT();
  const [msgUnread, setMsgUnread] = useState(0);

  useEffect(() => {
    if (!user) { setMsgUnread(0); return; }
    let cancelled = false;
    const refresh = async () => {
      const chats = await listMyChats();
      if (!cancelled) setMsgUnread(chats.reduce((s, c) => s + c.unread, 0));
    };
    void refresh();
    const ch = supabase.channel(`msg-unread:${user.id}:${Math.random().toString(36).slice(2)}`);
    ch.on("postgres_changes" as any, { event: "INSERT", schema: "public", table: "chat_messages" }, () => { void refresh(); })
      .on("postgres_changes" as any, { event: "UPDATE", schema: "public", table: "chat_participants", filter: `user_id=eq.${user.id}` }, () => { void refresh(); })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [user?.id]);


  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const initials = (profile?.name ?? profile?.email ?? "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mobileNavItems = [
    { path: "/", icon: Home, label: t("nav.home") },
    { path: "/news", icon: Newspaper, label: t("nav.newsfeed") },
    { path: "/shops", icon: Store, label: t("nav.shops") },
    { path: "/roasters", icon: Package, label: t("nav.roasters") },
    { path: "/coffee", icon: Coffee, label: t("nav.coffee") },
    { path: "/messages", icon: MessageSquare, label: t("nav.messages") },
    { path: "/guides", icon: BookOpen, label: t("nav.guides") },
    { path: "/recipes", icon: BookOpen, label: t("nav.recipes") },
    { path: "/equipment", icon: ShoppingBag, label: t("nav.equipment") },
    { path: "/journal", icon: PenLine, label: t("nav.journal") },
    { path: "/academy", icon: GraduationCap, label: t("nav.academy") },
    { path: "/jobs", icon: Briefcase, label: t("nav.jobs") },
    { path: "/wiki", icon: BookMarked, label: t("nav.wiki") },
    { path: "/forum", icon: MessageSquare, label: t("nav.forum") },
    { path: "/library", icon: Library, label: t("nav.library") },
    { path: "/profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <>
      {/* Desktop/Tablet Top Bar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16">
        <div className="w-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CoffeePlanets logo" className="w-9 h-9 rounded-full object-cover" />
            <span className="text-xl font-bold">CoffeePlanets</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/messages" className="relative p-2 hover:bg-accent rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5 text-foreground" />
              {msgUnread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs">
                  {msgUnread > 99 ? "99+" : msgUnread}
                </Badge>
              )}
            </Link>

            <LanguageSelector />

            <NotificationBell />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="cursor-pointer hover:ring-2 ring-primary transition-all">
                    <AvatarImage src={profile?.avatar_url ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card">
                  {profile && (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{profile.name ?? profile.email}</div>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      <span>{t("nav.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  {hasRole("admin") && (
                    <DropdownMenuItem asChild>
                      <Link to="/settings/user-management" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>{t("nav.admin_settings")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4" />
                    <span>{t("nav.sign_out")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
                <LogIn className="w-4 h-4" />
                {t("nav.sign_in")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Logo + Title on Left, Avatar on Right */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14">
        <div className="w-full px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CoffeePlanets logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-lg font-bold">CoffeePlanets</span>
          </Link>
          
          {isAuthenticated && (
            <div className="flex items-center gap-1 ml-auto mr-2">
              <Link to="/messages" className="relative p-1.5 hover:bg-accent rounded-lg">
                <MessageSquare className="w-5 h-5" />
                {msgUnread > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px]">
                    {msgUnread > 9 ? "9+" : msgUnread}
                  </Badge>
                )}
              </Link>
              <NotificationBell />
            </div>
          )}
          <LanguageSelector compact />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="cursor-pointer hover:ring-2 ring-primary transition-all h-9 w-9">
                  <AvatarImage src={profile?.avatar_url ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card">
                {profile && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{profile.name ?? profile.email}</div>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>{t("nav.profile")}</span>
                  </Link>
                </DropdownMenuItem>
                {hasRole("admin") && (
                  <DropdownMenuItem asChild>
                    <Link to="/settings/user-management" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span>{t("nav.admin_settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span>{t("nav.sign_out")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              <LogIn className="w-4 h-4" />
              {t("nav.sign_in")}
            </Link>
          )}
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

      {/* Spacer for fixed top navigation */}
      <div className="h-14 md:h-16" />
    </>
  );
};

export default Navigation;
