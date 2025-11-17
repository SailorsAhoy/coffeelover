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
import NotFound from "./pages/NotFound";

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
                  <Route path="/shops" element={<Shops />} />
                  <Route path="/roasters" element={<Roasters />} />
                  <Route path="/coffee" element={<Coffee />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/equipment" element={<Equipment />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/journal/products/new" element={<JournalProductNew />} />
                  <Route path="/journal/brews/new" element={<JournalBrewNew />} />
                  <Route path="/academy" element={<Academy />} />
                  <Route path="/academy/:id" element={<AcademyDetail />} />
                  <Route path="/profile" element={<Profile />} />
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
