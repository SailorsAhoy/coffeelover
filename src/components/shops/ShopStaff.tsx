import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import type { StaffMember } from "@/lib/shopsData";

interface Props {
  staff: StaffMember[];
}

export const ShopStaff = ({ staff }: Props) => {
  if (!staff || staff.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          No staff listed yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-2">
      {staff.map((s) => (
        <li key={s.id}>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={s.avatar} alt={s.name} />
                <AvatarFallback>
                  {s.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.role}
                </p>
              </div>
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent"
                  aria-label={`Email ${s.name}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export default ShopStaff;
