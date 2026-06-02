import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { RequireAuth } from "./components/RequireAuth";
import Shops from "./pages/Shops";
import Roasters from "./pages/Roasters";
import Coffee from "./pages/Coffee";
import Guides from "./pages/Guides";
import Recipes from "./pages/Recipes";
import Equipment from "./pages/Equipment";
import Journal from "./pages/Journal";
import JournalProductNew from "./pages/JournalProductNew";
import JournalBrewNew from "./pages/JournalBrewNew";
import Academy from "./pages/Academy";
import AcademyDetail from "./pages/AcademyDetail";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Wiki from "./pages/Wiki";
import Forum from "./pages/Forum";
import Library from "./pages/Library";
import ShopProfile from "./pages/ShopProfile";
import RoasterProfile from "./pages/RoasterProfile";
import CoffeeProduct from "./pages/CoffeeProduct";
import NotFound from "./pages/NotFound";
import SocialConnect from "./pages/SocialConnect";
import MessagingBoard from "./pages/MessagingBoard";
import Settings from "./pages/Settings";
import ShopTypesManagement from "./pages/settings/ShopTypesManagement";
import ShopManagement from "./pages/settings/ShopManagement";
import UserManagement from "./pages/settings/UserManagement";
import ContentManagement from "./pages/settings/ContentManagement";
import SystemSettings from "./pages/settings/SystemSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <div className="hidden md:block">
              <AppSidebar />
            </div>
            <div className="flex-1 flex flex-col">
              <Navigation />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/shops" element={<Shops />} />
                  <Route path="/roasters" element={<Roasters />} />
                  <Route path="/coffee" element={<Coffee />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/equipment" element={<Equipment />} />
                  <Route path="/journal" element={<RequireAuth><Journal /></RequireAuth>} />
                  <Route path="/journal/products/new" element={<RequireAuth><JournalProductNew /></RequireAuth>} />
                  <Route path="/journal/brews/new" element={<RequireAuth><JournalBrewNew /></RequireAuth>} />
                  <Route path="/academy" element={<Academy />} />
                  <Route path="/academy/:id" element={<AcademyDetail />} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/wiki" element={<Wiki />} />
                  <Route path="/forum" element={<Forum />} />
          <Route path="/library" element={<Library />} />
          <Route path="/social" element={<RequireAuth><SocialConnect /></RequireAuth>} />
          <Route path="/messaging" element={<RequireAuth><MessagingBoard /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth roles={["admin"]}><Settings /></RequireAuth>}>
            <Route path="shop-types" element={<ShopTypesManagement />} />
            <Route path="shop-management" element={<ShopManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="content-management" element={<ContentManagement />} />
            <Route path="system-settings" element={<SystemSettings />} />
          </Route>
          <Route path="/shop/:id" element={<ShopProfile />} />
          <Route path="/roaster/:id" element={<RoasterProfile />} />
          <Route path="/coffee/:id" element={<CoffeeProduct />} />
          <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
