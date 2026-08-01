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
import RecipeDetail from "./pages/RecipeDetail";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
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
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ShopTypesManagement from "./pages/settings/ShopTypesManagement";
import ShopManagement from "./pages/settings/ShopManagement";
import FieldPermissions from "./pages/settings/FieldPermissions";
import UserManagement from "./pages/settings/UserManagement";
import ContentManagement from "./pages/settings/ContentManagement";
import SystemSettings from "./pages/settings/SystemSettings";
import Imports from "./pages/settings/Imports";
import ImportCategory from "./pages/settings/ImportCategory";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import ShopOwnerDashboard from "./pages/dashboard/ShopOwnerDashboard";
import RoasteryDashboard from "./pages/dashboard/RoasteryDashboard";
import ManufacturerDashboard from "./pages/dashboard/ManufacturerDashboard";
import SupplierDashboard from "./pages/dashboard/SupplierDashboard";
import Welcome from "./pages/Welcome";
import News from "./pages/News";
import NewsPost from "./pages/NewsPost";
import NewsEditor from "./pages/NewsEditor";
import MyNewsPosts from "./pages/MyNewsPosts";
import { GatedRoute } from "./components/GatedRoute";
import SiteFooter from "./components/SiteFooter";


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
                  <Route path="/welcome/:slug" element={<Welcome />} />
                  <Route path="/shops" element={<GatedRoute slug="shops"><Shops /></GatedRoute>} />
                  <Route path="/roasters" element={<GatedRoute slug="roasters"><Roasters /></GatedRoute>} />
                  <Route path="/coffee" element={<GatedRoute slug="coffee"><Coffee /></GatedRoute>} />
                  <Route path="/guides" element={<GatedRoute slug="guides"><Guides /></GatedRoute>} />
                  <Route path="/recipes" element={<GatedRoute slug="recipes"><Recipes /></GatedRoute>} />
                  <Route path="/recipes/:id" element={<GatedRoute slug="recipes"><RecipeDetail /></GatedRoute>} />

                  <Route path="/equipment" element={<GatedRoute slug="equipment"><Equipment /></GatedRoute>} />
                  <Route path="/equipment/brand/:slug" element={<GatedRoute slug="equipment"><EquipmentDetail kind="brand" /></GatedRoute>} />
                  <Route path="/equipment/machine/:slug" element={<GatedRoute slug="equipment"><EquipmentDetail kind="machine" /></GatedRoute>} />
                  <Route path="/equipment/accessory/:slug" element={<GatedRoute slug="equipment"><EquipmentDetail kind="accessory" /></GatedRoute>} />
                  <Route path="/journal" element={<RequireAuth><Journal /></RequireAuth>} />
                  <Route path="/journal/products/new" element={<RequireAuth><JournalProductNew /></RequireAuth>} />
                  <Route path="/journal/brews/new" element={<RequireAuth><JournalBrewNew /></RequireAuth>} />
                  <Route path="/academy" element={<GatedRoute slug="academy"><Academy /></GatedRoute>} />
                  <Route path="/academy/:id" element={<GatedRoute slug="academy"><AcademyDetail /></GatedRoute>} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  <Route path="/jobs" element={<GatedRoute slug="jobs"><Jobs /></GatedRoute>} />
                  <Route path="/wiki" element={<GatedRoute slug="wiki"><Wiki /></GatedRoute>} />
                  <Route path="/forum" element={<GatedRoute slug="forum"><Forum /></GatedRoute>} />
          <Route path="/library" element={<GatedRoute slug="library"><Library /></GatedRoute>} />
          <Route path="/social" element={<RequireAuth><SocialConnect /></RequireAuth>} />
          <Route path="/messaging" element={<RequireAuth><MessagingBoard /></RequireAuth>} />
          <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/messages/:chatId" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth roles={["admin"]}><Settings /></RequireAuth>}>
            <Route path="shop-types" element={<ShopTypesManagement />} />
            <Route path="shop-management" element={<ShopManagement />} />
            <Route path="field-permissions" element={<FieldPermissions />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="content-management" element={<ContentManagement />} />
            <Route path="system-settings" element={<SystemSettings />} />
            <Route path="imports" element={<Imports />} />
            <Route path="imports/:category" element={<ImportCategory />} />
          </Route>
          <Route path="/shop/:id" element={<GatedRoute slug="shops"><ShopProfile /></GatedRoute>} />
          <Route path="/roaster/:id" element={<GatedRoute slug="roasters"><RoasterProfile /></GatedRoute>} />
          <Route path="/coffee/:id" element={<GatedRoute slug="coffee"><CoffeeProduct /></GatedRoute>} />
          <Route path="/dashboard" element={<RequireAuth><DashboardHome /></RequireAuth>} />
          <Route path="/dashboard/admin" element={<RequireAuth roles={["admin"]}><AdminDashboard /></RequireAuth>} />
          <Route path="/dashboard/user" element={<RequireAuth><UserDashboard /></RequireAuth>} />
          <Route path="/dashboard/teacher" element={<RequireAuth roles={["teacher","admin"]}><TeacherDashboard /></RequireAuth>} />
          <Route path="/dashboard/shop" element={<RequireAuth roles={["coffee_shop","company","staff","admin"]}><ShopOwnerDashboard /></RequireAuth>} />
          <Route path="/dashboard/roastery" element={<RequireAuth roles={["roaster","producer","admin"]}><RoasteryDashboard /></RequireAuth>} />
          <Route path="/dashboard/manufacturer" element={<RequireAuth roles={["manufacturer","admin"]}><ManufacturerDashboard /></RequireAuth>} />
          <Route path="/dashboard/supplier" element={<RequireAuth roles={["supplier","admin"]}><SupplierDashboard /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <SiteFooter />
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
