import { Outlet, Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Store, Users, FileText, Cog, Tag, ShieldCheck } from "lucide-react";

const Settings = () => {
  const location = useLocation();
  
  const settingsNavItems = [
    { title: "Shop Types", icon: Tag, url: "/settings/shop-types" },
    { title: "Shop Management", icon: Store, url: "/settings/shop-management" },
    { title: "Field Permissions", icon: ShieldCheck, url: "/settings/field-permissions" },
    { title: "User Management", icon: Users, url: "/settings/user-management" },
    { title: "Content Management", icon: FileText, url: "/settings/content-management" },
    { title: "System Settings", icon: Cog, url: "/settings/system-settings" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="p-4 h-fit">
            <nav className="space-y-1">
              {settingsNavItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.url
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
