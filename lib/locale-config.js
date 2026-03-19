/**
 * Get locale-aware configuration value
 * If the config value is an object with locale keys, return the value for current locale
 * Otherwise return the value as-is
 *
 * @param {*} configValue - The configuration value (can be string, array, or object with locale keys)
 * @param {string} locale - Current locale (e.g., 'zh-CN', 'en-US')
 * @param {*} defaultLocale - Default locale to fallback to (default: 'zh-CN')
 * @returns {*} The locale-specific value or the original value
 */
export function getLocaleConfig(configValue, locale, defaultLocale = 'zh-CN') {
  // If configValue is null or undefined, return as-is
  if (configValue === null || configValue === undefined) {
    return configValue
  }

  // If configValue is not an object, return as-is
  if (typeof configValue !== 'object') {
    return configValue
  }

  // If configValue is an array, return as-is
  if (Array.isArray(configValue)) {
    return configValue
  }

  // Check if this is a locale-aware config (has locale keys like 'zh-CN', 'en-US')
  const hasLocaleKeys = Object.keys(configValue).some(key =>
    key.match(/^[a-z]{2}-[A-Z]{2}$/)
  )

  if (!hasLocaleKeys) {
    return configValue
  }

  // Return the value for current locale, or fallback to default locale, or first available
  return configValue[locale] ||
         configValue[defaultLocale] ||
         Object.values(configValue)[0]
}
