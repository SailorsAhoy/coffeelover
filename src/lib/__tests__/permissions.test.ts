import { describe, it, expect } from "vitest";
import { evaluate } from "@/lib/permissions";
import type { AppRole } from "@/hooks/useCurrentUser";

const user = { id: "u1" } as any;

const ctx = (roles: AppRole[], modules: string[] = []) => ({
  user,
  roles,
  hasModule: (m: string) => modules.includes(m),
});

describe("permissions — shop manager gating", () => {
  it("anonymous users cannot list/edit a shop", () => {
    const anonymous = { user: null, roles: [], hasModule: () => false };
    expect(evaluate("list_shop", anonymous)).toBe(false);
  });

  it("regular user role cannot edit shop fields (banner/hours/affiliates)", () => {
    expect(evaluate("list_shop", ctx(["user"]))).toBe(false);
    expect(evaluate("list_shop", ctx(["pro_user"]))).toBe(false);
    expect(evaluate("list_shop", ctx(["staff"]))).toBe(false);
  });

  it("coffee_shop / company role with the shop_listing module can edit", () => {
    expect(evaluate("list_shop", ctx(["coffee_shop"], ["shop_listing"]))).toBe(true);
    expect(evaluate("list_shop", ctx(["company"], ["shop_listing"]))).toBe(true);
  });

  it("coffee_shop role WITHOUT module is still read-only", () => {
    expect(evaluate("list_shop", ctx(["coffee_shop"]))).toBe(false);
  });

  it("admin bypasses module requirement", () => {
    expect(evaluate("list_shop", ctx(["admin"]))).toBe(true);
  });
});
