/*
Language switcher — minimal, premium, accessible
*/

import { useI18n, type Lang } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options: { lang: Lang; label: string; native: string }[] = [
  { lang: "en", label: "English", native: "English" },
  { lang: "ar-EG", label: "Egyptian Arabic", native: "العربية (مصر)" },
  { lang: "ja", label: "Japanese", native: "日本語" },
  { lang: "es", label: "Spanish", native: "Español" },
  { lang: "it", label: "Italian", native: "Italiano" },
  { lang: "fr", label: "French", native: "Français" },
  { lang: "de", label: "German", native: "Deutsch" },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const current = options.find((o) => o.lang === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/6 hover:bg-white/10"
          aria-label={t("lang.label")}
        >
          {current?.native ?? "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {options.map((o) => (
          <DropdownMenuItem key={o.lang} onClick={() => setLang(o.lang)}>
            <span className="flex-1">{o.native}</span>
            <span className="text-xs text-muted-foreground">{o.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
