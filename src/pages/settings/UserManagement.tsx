import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, Shield } from "lucide-react";

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search-users">Search Users</Label>
              <Input id="search-users" placeholder="Search by name or email..." />
            </div>

            {/* Sample User List */}
            <div className="border rounded-lg divide-y">
              {[
                { name: "Sarah Johnson", email: "sarah@example.com", role: "Admin" },
                { name: "Mike Chen", email: "mike@example.com", role: "Roaster" },
                { name: "Emma Wilson", email: "emma@example.com", role: "Coffee Shop" },
                { name: "James Rodriguez", email: "james@example.com", role: "User" },
              ].map((user, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                      {user.role === "Admin" && <Shield className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
