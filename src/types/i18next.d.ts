/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next';

import enTranslation from '@/locale/translations/en.json';
import esTranslation from '@/locale/translations/es.json';
import itTranslation from '@/locale/translations/it.json';
import plTranslation from '@/locale/translations/pl.json';

const resources = {
  es: esTranslation,
  en: enTranslation,
  it: itTranslation,
  pl: plTranslation,
} as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: string;
    resources: typeof resources;
    returnNull: false;
  }
}
