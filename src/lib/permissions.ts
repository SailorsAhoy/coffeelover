import type { User } from "@supabase/supabase-js";
import type { AppRole } from "@/hooks/useCurrentUser";

export type Permission =
  | "view_public_content"
  | "comment"
  | "rate"
  | "suggest_shop"
  | "suggest_brand"
  | "use_journal"
  | "use_journal_pro"
  | "apply_to_job"
  | "post_job"
  | "list_shop"
  | "list_roaster"
  | "list_equipment"
  | "publish_course"
  | "manage_company"
  | "access_admin";

interface Ctx {
  user: User | null;
  roles: AppRole[];
  hasModule: (mod: string) => boolean;
}

export const evaluate = (
  permission: Permission,
  ctx: Ctx,
  _extra?: Record<string, unknown>,
): boolean => {
  const { user, roles, hasModule } = ctx;
  const authed = !!user;
  const has = (r: AppRole) => roles.includes(r);

  switch (permission) {
    case "view_public_content":
      return true;
    case "comment":
    case "rate":
    case "suggest_shop":
    case "suggest_brand":
    case "use_journal":
      return authed;
    case "use_journal_pro":
      return authed && (hasModule("journal_pro") || has("admin"));
    case "apply_to_job":
      return authed;
    case "post_job":
      return authed && has("company") && (hasModule("jobs_post") || has("admin"));
    case "list_shop":
      return authed && (has("company") || has("coffee_shop")) && (hasModule("shop_listing") || has("admin"));
    case "list_roaster":
      return authed && (has("company") || has("roaster")) && (hasModule("roaster_listing") || has("admin"));
    case "list_equipment":
      return authed && has("company") && (hasModule("equipment_listing") || has("admin"));
    case "publish_course":
      return authed && has("teacher") && (hasModule("course_publishing") || has("admin"));
    case "manage_company":
      return authed && (has("company") || has("staff") || has("admin"));
    case "access_admin":
      return authed && has("admin");
    default:
      return false;
  }
};
