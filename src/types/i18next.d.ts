/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next';
import esTranslation from '@/locale/translations/es.json';
import itTranslation from '@/locale/translations/it.json';
import enTranslation from '@/locale/translations/en.json';

const resources = {
  es: esTranslation,
  it: itTranslation,
  en: enTranslation,
} as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: string;
    resources: typeof resources;
    returnNull: false;
  }
}
