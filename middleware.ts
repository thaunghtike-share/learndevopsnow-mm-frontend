// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'my'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  // Match ALL paths to add locale
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'  // Match all except files, api, etc.
  ]
};