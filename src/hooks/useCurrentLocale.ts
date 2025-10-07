import { useTranslation } from 'react-i18next';

export function useCurrentLocale() {
  const { i18n } = useTranslation();
  return i18n.language;
}
