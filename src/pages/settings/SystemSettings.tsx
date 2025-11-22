import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure application-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Coffee Community" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea id="site-description" defaultValue="A community for coffee enthusiasts" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" defaultValue="contact@coffeecommunity.com" />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Feature Toggles</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shop Reviews</Label>
                <p className="text-sm text-muted-foreground">Enable user reviews for shops</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Social Connect</Label>
                <p className="text-sm text-muted-foreground">Enable social networking features</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Messaging</Label>
                <p className="text-sm text-muted-foreground">Enable direct messaging between users</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Map Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="default-lat">Default Latitude</Label>
              <Input id="default-lat" type="number" step="0.0001" defaultValue="40.7589" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-lng">Default Longitude</Label>
              <Input id="default-lng" type="number" step="0.0001" defaultValue="-73.9851" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-zoom">Default Zoom Level</Label>
              <Input id="default-zoom" type="number" min="1" max="20" defaultValue="13" />
            </div>
          </div>

          <div className="pt-6">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
