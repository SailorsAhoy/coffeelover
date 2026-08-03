import { useI18n } from "@/contexts/I18nContext";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LanguageSelector = ({ compact = false }: { compact?: boolean }) => {
  const { locale, setLocale, languages, t } = useI18n();
  const current = languages.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.language")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg hover:bg-accent transition-colors outline-none",
          compact ? "p-1.5" : "px-2.5 py-2",
        )}
      >
        {current?.flag_emoji ? (
          <span className="text-base leading-none">{current.flag_emoji}</span>
        ) : (
          <Globe className="w-5 h-5" />
        )}
        {!compact && (
          <span className="text-sm font-medium uppercase">{current?.code ?? locale}</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card max-h-80 overflow-y-auto z-50">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLocale(l.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="w-5 text-base leading-none">{l.flag_emoji ?? "🌐"}</span>
            <span className="flex-1 truncate">{l.native_name}</span>
            {l.code === locale && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
