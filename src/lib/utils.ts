import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, isValid } from 'date-fns';
import { ru, ro, enGB } from 'date-fns/locale';

const locales: Record<string, any> = {
  ru,
  ro,
  en: enGB,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArticleDate(dateStr: string, currentLang: string) {
  if (!dateStr) return '';

  let parsedDate = new Date(dateStr);

  // If it's not a standard date format, try to parse it as our legacy Russian format
  if (!isValid(parsedDate)) {
    try {
      parsedDate = parse(dateStr, 'd MMMM yyyy', new Date(), { locale: ru });
    } catch (e) {
      return dateStr;
    }
  }

  // If still not valid, return original
  if (!isValid(parsedDate)) return dateStr;

  try {
    return format(parsedDate, 'd MMMM yyyy', {
      locale: locales[currentLang] || ru
    });
  } catch (e) {
    return dateStr;
  }
}
