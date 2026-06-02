import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";
import { useCurrentUser, type AppRole } from "@/hooks/useCurrentUser";

vi.mock("@/hooks/useCurrentUser", () => ({ useCurrentUser: vi.fn() }));

const setUser = (opts: { authed: boolean; roles?: AppRole[]; loading?: boolean }) => {
  (useCurrentUser as any).mockReturnValue({
    loading: opts.loading ?? false,
    isAuthenticated: opts.authed,
    hasRole: (r: AppRole) => (opts.roles ?? []).includes(r),
  });
};

const Protected = ({ roles, label }: { roles?: AppRole[]; label: string }) => (
  <MemoryRouter initialEntries={["/d"]}>
    <Routes>
      <Route
        path="/d"
        element={
          <RequireAuth roles={roles}>
            <div>OK:{label}</div>
          </RequireAuth>
        }
      />
      <Route path="/" element={<div>HOME</div>} />
      <Route path="/auth" element={<div>LOGIN</div>} />
    </Routes>
  </MemoryRouter>
);

// Mirror the gating used in App.tsx dashboard routes
const ROUTES: Array<{ name: string; roles?: AppRole[] }> = [
  { name: "/dashboard", roles: undefined }, // any authed
  { name: "/dashboard/admin", roles: ["admin"] },
  { name: "/dashboard/user", roles: undefined },
  { name: "/dashboard/teacher", roles: ["teacher", "admin"] },
  { name: "/dashboard/shop", roles: ["coffee_shop", "company", "staff", "admin"] },
  { name: "/dashboard/roastery", roles: ["roaster", "producer", "admin"] },
  { name: "/dashboard/manufacturer", roles: ["manufacturer", "admin"] },
  { name: "/dashboard/supplier", roles: ["supplier", "admin"] },
];

describe("Dashboard route permission gating", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects unauthenticated users to /auth for every dashboard route", () => {
    setUser({ authed: false });
    for (const r of ROUTES) {
      const { unmount } = render(<Protected roles={r.roles} label={r.name} />);
      expect(screen.getByText("LOGIN"), `expected /auth for ${r.name}`).toBeInTheDocument();
      unmount();
    }
  });

  it("redirects authed users without the required role to /", () => {
    setUser({ authed: true, roles: ["user"] });
    for (const r of ROUTES.filter((x) => x.roles && x.roles.length)) {
      const { unmount } = render(<Protected roles={r.roles} label={r.name} />);
      expect(screen.getByText("HOME"), `expected redirect for ${r.name}`).toBeInTheDocument();
      unmount();
    }
  });

  it("admin can access every role-gated dashboard", () => {
    setUser({ authed: true, roles: ["admin"] });
    for (const r of ROUTES) {
      const { unmount } = render(<Protected roles={r.roles} label={r.name} />);
      expect(screen.getByText(`OK:${r.name}`)).toBeInTheDocument();
      unmount();
    }
  });

  it("each role can access only its own dashboard", () => {
    const cases: Array<[AppRole, string]> = [
      ["teacher", "/dashboard/teacher"],
      ["coffee_shop", "/dashboard/shop"],
      ["roaster", "/dashboard/roastery"],
      ["manufacturer", "/dashboard/manufacturer"],
      ["supplier", "/dashboard/supplier"],
    ];
    for (const [role, allowed] of cases) {
      setUser({ authed: true, roles: [role] });
      for (const r of ROUTES) {
        const { unmount } = render(<Protected roles={r.roles} label={r.name} />);
        const expected = !r.roles || r.roles.includes(role) ? `OK:${r.name}` : "HOME";
        expect(screen.getByText(expected), `${role} -> ${r.name}`).toBeInTheDocument();
        unmount();
      }
    }
  });

  it("any authenticated user can reach /dashboard and /dashboard/user", () => {
    setUser({ authed: true, roles: ["user"] });
    const open = ROUTES.filter((r) => !r.roles);
    for (const r of open) {
      const { unmount } = render(<Protected roles={r.roles} label={r.name} />);
      expect(screen.getByText(`OK:${r.name}`)).toBeInTheDocument();
      unmount();
    }
  });
});
