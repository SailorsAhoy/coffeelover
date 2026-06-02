import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Build a chainable query mock that records each filter call.
type Call = { method: string; args: any[] };
let calls: Call[] = [];

const makeChain = (table: string) => {
  const chain: any = {};
  const record = (method: string) => (...args: any[]) => {
    calls.push({ method: `${table}.${method}`, args });
    return chain;
  };
  chain.select = record("select");
  chain.order = record("order");
  chain.limit = record("limit");
  chain.gte = record("gte");
  chain.eq = record("eq");
  chain.in = record("in");
  // Make the chain awaitable -> resolves to empty list
  chain.then = (resolve: any) => resolve({ data: [], error: null });
  return chain;
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (table: string) => makeChain(table) },
}));

import { ActivityLog } from "@/components/dashboard/ActivityLog";

const wrapper = (ui: React.ReactNode) => <MemoryRouter>{ui}</MemoryRouter>;

const lastActivityCalls = () => calls.filter((c) => c.method.startsWith("activity_log."));

describe("Admin ActivityLog — filter gating", () => {
  beforeEach(() => {
    calls = [];
  });

  it("applies the date-range filter via gte('created_at', sinceISO) when provided", async () => {
    const since = "2026-05-01T00:00:00.000Z";
    render(wrapper(<ActivityLog sinceISO={since} />));
    await waitFor(() => {
      const gte = lastActivityCalls().find((c) => c.method === "activity_log.gte");
      expect(gte).toBeTruthy();
      expect(gte!.args).toEqual(["created_at", since]);
    });
  });

  it("does not add a date filter when sinceISO is null", async () => {
    render(wrapper(<ActivityLog sinceISO={null} />));
    await waitFor(() => {
      expect(lastActivityCalls().some((c) => c.method === "activity_log.order")).toBe(true);
    });
    expect(lastActivityCalls().some((c) => c.method === "activity_log.gte")).toBe(false);
  });

  it("does not constrain entity_type/action when both filters are 'all'", async () => {
    render(wrapper(<ActivityLog sinceISO={null} />));
    await waitFor(() => expect(lastActivityCalls().length).toBeGreaterThan(0));
    const eqCalls = lastActivityCalls().filter((c) => c.method === "activity_log.eq");
    expect(eqCalls.find((c) => c.args[0] === "entity_type")).toBeUndefined();
    expect(eqCalls.find((c) => c.args[0] === "action")).toBeUndefined();
  });

  it("scopes by entity_type when an entity filter is chosen", async () => {
    render(wrapper(<ActivityLog sinceISO={null} />));
    await waitFor(() => expect(lastActivityCalls().length).toBeGreaterThan(0));

    // Open entity Select and pick "shop"
    const triggers = screen.getAllByRole("combobox");
    fireEvent.click(triggers[0]);
    const shopOpt = await screen.findByRole("option", { name: "shop" });
    calls = [];
    fireEvent.click(shopOpt);

    await waitFor(() => {
      const eqCalls = lastActivityCalls().filter((c) => c.method === "activity_log.eq");
      expect(eqCalls.find((c) => c.args[0] === "entity_type" && c.args[1] === "shop")).toBeTruthy();
    });
  });

  it("scopes by action when an action filter is chosen", async () => {
    render(wrapper(<ActivityLog sinceISO={null} />));
    await waitFor(() => expect(lastActivityCalls().length).toBeGreaterThan(0));

    const triggers = screen.getAllByRole("combobox");
    fireEvent.click(triggers[1]);
    const opt = await screen.findByRole("option", { name: "deleted" });
    calls = [];
    fireEvent.click(opt);

    await waitFor(() => {
      const eqCalls = lastActivityCalls().filter((c) => c.method === "activity_log.eq");
      expect(eqCalls.find((c) => c.args[0] === "action" && c.args[1] === "deleted")).toBeTruthy();
    });
  });

  it("always orders by created_at desc and limits to 200 rows", async () => {
    render(wrapper(<ActivityLog sinceISO={null} />));
    await waitFor(() => {
      const order = lastActivityCalls().find((c) => c.method === "activity_log.order");
      const limit = lastActivityCalls().find((c) => c.method === "activity_log.limit");
      expect(order?.args[0]).toBe("created_at");
      expect(order?.args[1]).toMatchObject({ ascending: false });
      expect(limit?.args[0]).toBe(200);
    });
  });
});
