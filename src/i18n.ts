import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// Can be imported from a shared config
export const locales = ["en", "zh", "jp"]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`./config/dictionaries/${locale}.json`)).default,
  }
})

export const localesMap = {
  en: "English",
  zh: "中文",
  jp: "日語",
}
