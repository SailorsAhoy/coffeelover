-- 1. Languages
CREATE TABLE public.languages (
  code text PRIMARY KEY,
  name text NOT NULL,
  native_name text NOT NULL,
  flag_emoji text,
  enabled boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.languages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.languages TO authenticated;
GRANT ALL ON public.languages TO service_role;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Languages are readable by everyone" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Admins manage languages" ON public.languages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. UI strings (core texts, English source of truth)
CREATE TABLE public.ui_strings (
  key text PRIMARY KEY,
  namespace text NOT NULL DEFAULT 'common',
  en_value text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ui_strings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ui_strings TO authenticated;
GRANT ALL ON public.ui_strings TO service_role;
ALTER TABLE public.ui_strings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "UI strings are readable by everyone" ON public.ui_strings FOR SELECT USING (true);
CREATE POLICY "Admins manage ui strings" ON public.ui_strings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. UI translations
CREATE TABLE public.ui_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  string_key text NOT NULL REFERENCES public.ui_strings(key) ON DELETE CASCADE,
  locale text NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  value text NOT NULL,
  is_machine boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (string_key, locale)
);
CREATE INDEX ui_translations_locale_idx ON public.ui_translations(locale);
GRANT SELECT ON public.ui_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ui_translations TO authenticated;
GRANT ALL ON public.ui_translations TO service_role;
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "UI translations are readable by everyone" ON public.ui_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage ui translations" ON public.ui_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Content translations (database entries)
CREATE TABLE public.content_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  row_id text NOT NULL,
  column_name text NOT NULL,
  locale text NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  value text NOT NULL,
  is_machine boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (table_name, row_id, column_name, locale)
);
CREATE INDEX content_translations_lookup_idx ON public.content_translations(table_name, locale);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_translations TO authenticated;
GRANT ALL ON public.content_translations TO service_role;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Content translations readable by signed-in users" ON public.content_translations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage content translations" ON public.content_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Preferred language on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en';

-- 6. updated_at triggers
CREATE TRIGGER languages_updated_at BEFORE UPDATE ON public.languages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ui_strings_updated_at BEFORE UPDATE ON public.ui_strings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ui_translations_updated_at BEFORE UPDATE ON public.ui_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER content_translations_updated_at BEFORE UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Seed languages: English + 23 other official EU languages + Russian
INSERT INTO public.languages (code, name, native_name, flag_emoji, enabled, is_default, sort_order) VALUES
  ('en','English','English','🇬🇧',true,true,0),
  ('bg','Bulgarian','Български','🇧🇬',true,false,10),
  ('hr','Croatian','Hrvatski','🇭🇷',true,false,11),
  ('cs','Czech','Čeština','🇨🇿',true,false,12),
  ('da','Danish','Dansk','🇩🇰',true,false,13),
  ('nl','Dutch','Nederlands','🇳🇱',true,false,14),
  ('et','Estonian','Eesti','🇪🇪',true,false,15),
  ('fi','Finnish','Suomi','🇫🇮',true,false,16),
  ('fr','French','Français','🇫🇷',true,false,17),
  ('de','German','Deutsch','🇩🇪',true,false,18),
  ('el','Greek','Ελληνικά','🇬🇷',true,false,19),
  ('hu','Hungarian','Magyar','🇭🇺',true,false,20),
  ('ga','Irish','Gaeilge','🇮🇪',true,false,21),
  ('it','Italian','Italiano','🇮🇹',true,false,22),
  ('lv','Latvian','Latviešu','🇱🇻',true,false,23),
  ('lt','Lithuanian','Lietuvių','🇱🇹',true,false,24),
  ('mt','Maltese','Malti','🇲🇹',true,false,25),
  ('pl','Polish','Polski','🇵🇱',true,false,26),
  ('pt','Portuguese','Português','🇵🇹',true,false,27),
  ('ro','Romanian','Română','🇷🇴',true,false,28),
  ('sk','Slovak','Slovenčina','🇸🇰',true,false,29),
  ('sl','Slovenian','Slovenščina','🇸🇮',true,false,30),
  ('es','Spanish','Español','🇪🇸',true,false,31),
  ('sv','Swedish','Svenska','🇸🇪',true,false,32),
  ('ru','Russian','Русский','🇷🇺',true,false,40);