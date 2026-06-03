import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

// Mock supabase client used by useCurrentUser
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut: vi.fn(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }),
      }),
    }),
  },
}));

import ShopEditSheet from "@/components/shops/ShopEditSheet";
import { useCurrentUser } from "@/hooks/useCurrentUser";

vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(),
}));

const baseShop: any = {
  id: "s1",
  name: "Test",
  description: "A nice place to drink coffee",
  type: "coffee_shop",
  priceLevel: 2,
  address: "1 St",
  lat: 0,
  lng: 0,
  amenities: {},
  opening_hours: {},
  affiliateLinks: [],
};

describe("ShopEditSheet — role gating", () => {
  it("renders nothing for a regular member (cannot edit banner/hours/affiliates)", () => {
    (useCurrentUser as any).mockReturnValue({
      can: () => false, hasRole: () => false, user: null,
    });
    const { container } = render(<ShopEditSheet shop={baseShop} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the edit trigger for a shop manager", () => {
    (useCurrentUser as any).mockReturnValue({
      can: (p: string) => p === "list_shop", hasRole: () => false, user: null,
    });
    const { getByRole } = render(<ShopEditSheet shop={baseShop} />);
    expect(getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
