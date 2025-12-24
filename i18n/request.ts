import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Default to English if locale is not en or my
  const validLocale = locale === "en" || locale === "my" ? locale : "en";
  
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
    timeZone: "Asia/Yangon",
    now: new Date(),
  };
});