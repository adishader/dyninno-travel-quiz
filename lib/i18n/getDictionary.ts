import type { Locale } from "./locales";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";

export type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = { en, es };

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}

export function t(dict: Dictionary, key: string): string {
  const value = dict[key];
  if (value === undefined) {
    throw new Error(`Missing translation key: "${key}"`);
  }
  return value;
}
