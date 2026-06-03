import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  kind: "shop" | "roaster";
  id: string;
}

export default function LinkedListingButton({ kind, id }: Props) {
  const to = kind === "shop" ? `/shop/${id}` : `/roaster/${id}`;
  return (
    <Button asChild size="sm" variant="outline" className="gap-1">
      <Link to={to}>
        Visit {kind} <ExternalLink className="h-3 w-3" />
      </Link>
    </Button>
  );
}
