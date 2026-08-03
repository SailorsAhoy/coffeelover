/**
 * Base English catalog — the source of truth for core UI texts.
 * Keys are synced into the `ui_strings` table so admins can edit the English
 * wording and manage translations for every language.
 */
export interface StringDef {
  key: string;
  namespace: string;
  en: string;
}

export const BASE_STRINGS: StringDef[] = [
  // Navigation
  { key: "nav.home", namespace: "nav", en: "Home" },
  { key: "nav.dashboard", namespace: "nav", en: "Dashboard" },
  { key: "nav.newsfeed", namespace: "nav", en: "Newsfeed" },
  { key: "nav.news", namespace: "nav", en: "News" },
  { key: "nav.shops", namespace: "nav", en: "Shops" },
  { key: "nav.coffee_shops", namespace: "nav", en: "Coffee Shops" },
  { key: "nav.roasters", namespace: "nav", en: "Roasters" },
  { key: "nav.coffee", namespace: "nav", en: "Coffee" },
  { key: "nav.guides", namespace: "nav", en: "Guides" },
  { key: "nav.brewing_guides", namespace: "nav", en: "Brewing Guides" },
  { key: "nav.recipes", namespace: "nav", en: "Recipes" },
  { key: "nav.equipment", namespace: "nav", en: "Equipment" },
  { key: "nav.journal", namespace: "nav", en: "Journal" },
  { key: "nav.brewing_journal", namespace: "nav", en: "Brewing Journal" },
  { key: "nav.academy", namespace: "nav", en: "Academy" },
  { key: "nav.barista_academy", namespace: "nav", en: "Barista Academy" },
  { key: "nav.jobs", namespace: "nav", en: "Jobs" },
  { key: "nav.coffee_jobs", namespace: "nav", en: "Coffee Jobs" },
  { key: "nav.wiki", namespace: "nav", en: "Wiki" },
  { key: "nav.coffee_wiki", namespace: "nav", en: "Coffee Wiki" },
  { key: "nav.forum", namespace: "nav", en: "Forum" },
  { key: "nav.coffee_forum", namespace: "nav", en: "Coffee Forum" },
  { key: "nav.library", namespace: "nav", en: "Library" },
  { key: "nav.coffee_library", namespace: "nav", en: "Coffee Library" },
  { key: "nav.social", namespace: "nav", en: "Social Connect" },
  { key: "nav.messaging", namespace: "nav", en: "Messaging" },
  { key: "nav.messages", namespace: "nav", en: "Messages" },
  { key: "nav.profile", namespace: "nav", en: "Profile" },
  { key: "nav.settings", namespace: "nav", en: "Settings" },
  { key: "nav.admin_settings", namespace: "nav", en: "Admin Settings" },
  { key: "nav.toggle", namespace: "nav", en: "Toggle" },
  { key: "nav.sign_in", namespace: "nav", en: "Sign in" },
  { key: "nav.sign_out", namespace: "nav", en: "Log out" },
  { key: "nav.language", namespace: "nav", en: "Language" },

  // Common actions
  { key: "common.save", namespace: "common", en: "Save" },
  { key: "common.cancel", namespace: "common", en: "Cancel" },
  { key: "common.delete", namespace: "common", en: "Delete" },
  { key: "common.edit", namespace: "common", en: "Edit" },
  { key: "common.create", namespace: "common", en: "Create" },
  { key: "common.add", namespace: "common", en: "Add" },
  { key: "common.search", namespace: "common", en: "Search" },
  { key: "common.filter", namespace: "common", en: "Filters" },
  { key: "common.clear", namespace: "common", en: "Clear" },
  { key: "common.close", namespace: "common", en: "Close" },
  { key: "common.loading", namespace: "common", en: "Loading…" },
  { key: "common.saving", namespace: "common", en: "Saving…" },
  { key: "common.saved", namespace: "common", en: "Saved" },
  { key: "common.error", namespace: "common", en: "Something went wrong" },
  { key: "common.no_results", namespace: "common", en: "No results found" },
  { key: "common.view_all", namespace: "common", en: "View all" },
  { key: "common.back", namespace: "common", en: "Back" },
  { key: "common.next", namespace: "common", en: "Next" },
  { key: "common.previous", namespace: "common", en: "Previous" },
  { key: "common.all", namespace: "common", en: "All" },
  { key: "common.language", namespace: "common", en: "Language" },
  { key: "common.required", namespace: "common", en: "Required" },
  { key: "common.optional", namespace: "common", en: "Optional" },

  // Auth
  { key: "auth.sign_in", namespace: "auth", en: "Sign in" },
  { key: "auth.sign_up", namespace: "auth", en: "Sign up" },
  { key: "auth.email", namespace: "auth", en: "Email" },
  { key: "auth.password", namespace: "auth", en: "Password" },
  { key: "auth.name", namespace: "auth", en: "Name" },
  { key: "auth.forgot_password", namespace: "auth", en: "Forgot password?" },
  { key: "auth.create_account", namespace: "auth", en: "Create account" },
  { key: "auth.welcome_back", namespace: "auth", en: "Welcome back" },
  { key: "auth.marketing_opt_out", namespace: "auth", en: "I do not want to receive promotional emails of any kind" },

  // Footer
  { key: "footer.explore", namespace: "footer", en: "Explore" },
  { key: "footer.company", namespace: "footer", en: "CoffeePlanets" },
  { key: "footer.guides", namespace: "footer", en: "Guides" },
  { key: "footer.about", namespace: "footer", en: "About Us" },
  { key: "footer.faq", namespace: "footer", en: "FAQ" },
  { key: "footer.contact", namespace: "footer", en: "Contact" },
  { key: "footer.for_roasters", namespace: "footer", en: "Roasters" },
  { key: "footer.for_shop_owners", namespace: "footer", en: "Shop Owners" },
  { key: "footer.affiliates", namespace: "footer", en: "Affiliates" },
  { key: "footer.advertising", namespace: "footer", en: "Advertising" },
  { key: "footer.tagline", namespace: "footer", en: "The specialty coffee marketplace and community." },
  { key: "footer.rights", namespace: "footer", en: "All rights reserved." },

  // Welcome / landing
  { key: "welcome.locked_preview", namespace: "welcome", en: "Example listing — preview" },
  { key: "welcome.cta_title", namespace: "welcome", en: "Unlock the full CoffeePlanets experience" },
  { key: "welcome.cta_body", namespace: "welcome", en: "Create a free account to browse every listing, guide and recipe." },
  { key: "welcome.cta_button", namespace: "welcome", en: "Sign up free" },
  { key: "welcome.already_member", namespace: "welcome", en: "Already a member? Sign in" },

  // Profile
  { key: "profile.title", namespace: "profile", en: "Profile" },
  { key: "profile.my_account", namespace: "profile", en: "My account" },
  { key: "profile.preferred_language", namespace: "profile", en: "Preferred language" },
  { key: "profile.preferred_language_help", namespace: "profile", en: "This language is applied automatically when you sign in." },
  { key: "profile.email_preferences", namespace: "profile", en: "Email preferences" },
  { key: "profile.friends", namespace: "profile", en: "Friends" },
  { key: "profile.followers", namespace: "profile", en: "Followers" },
  { key: "profile.following", namespace: "profile", en: "Following" },
  { key: "profile.blocked", namespace: "profile", en: "Blocked" },

  // Admin — languages
  { key: "admin.languages", namespace: "admin", en: "Languages & Translations" },
  { key: "admin.languages_desc", namespace: "admin", en: "Manage available languages and edit every translated text." },
  { key: "admin.add_language", namespace: "admin", en: "Add language" },
  { key: "admin.language_code", namespace: "admin", en: "Code" },
  { key: "admin.language_name", namespace: "admin", en: "English name" },
  { key: "admin.native_name", namespace: "admin", en: "Native name" },
  { key: "admin.enabled", namespace: "admin", en: "Enabled" },
  { key: "admin.default", namespace: "admin", en: "Default" },
  { key: "admin.ui_texts", namespace: "admin", en: "Interface texts" },
  { key: "admin.content_texts", namespace: "admin", en: "Database content" },
  { key: "admin.auto_translate", namespace: "admin", en: "Auto-translate missing" },
  { key: "admin.translating", namespace: "admin", en: "Translating…" },
  { key: "admin.source_english", namespace: "admin", en: "English (source)" },
  { key: "admin.translation", namespace: "admin", en: "Translation" },
];

export const BASE_MAP: Record<string, string> = Object.fromEntries(
  BASE_STRINGS.map((s) => [s.key, s.en]),
);
