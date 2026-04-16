import { event as gtagEvent } from '@/lib/plugins/gtag'

const normalizeValue = value => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  return String(value)
}

export const trackEvent = ({ action, category, label, value }) => {
  if (typeof window === 'undefined') {
    return
  }

  gtagEvent({
    action,
    category,
    label,
    value
  })
}

export const trackCtaClick = ({ location, label, value }) => {
  trackEvent({
    action: 'cta_clicked',
    category: normalizeValue(location) || 'unknown',
    label: normalizeValue(label) || 'unknown',
    value
  })
}

export const trackSignupIntent = ({ location, provider }) => {
  trackEvent({
    action: 'signup_started',
    category: normalizeValue(location) || 'unknown',
    label: normalizeValue(provider) || 'unknown'
  })
}
