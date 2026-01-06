// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !['en', 'my'].includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    // FIXED: Import from correct path - from i18n folder to messages folder
    messages: (await import(`../messages/${locale}.json`)).default
  };
});