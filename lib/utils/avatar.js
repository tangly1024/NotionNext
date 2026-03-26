import md5 from 'js-md5'
import { siteConfig } from '@/lib/config'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

export const getSiteEmail = NOTION_CONFIG => {
  const plainEmail = siteConfig('EMAIL', null, NOTION_CONFIG)
  if (plainEmail) {
    return `${plainEmail}`.trim().toLowerCase()
  }

  const encryptedEmail = siteConfig('CONTACT_EMAIL', null, NOTION_CONFIG)
  if (!encryptedEmail) {
    return ''
  }

  const email = decryptEmail(encryptedEmail)
  return email ? `${email}`.trim().toLowerCase() : ''
}

export const getSiteEmailHash = NOTION_CONFIG => {
  const emailHash = siteConfig('EMAIL_HASH', null, NOTION_CONFIG)
  if (emailHash) {
    return `${emailHash}`.trim().toLowerCase()
  }

  const email = getSiteEmail(NOTION_CONFIG)
  if (!email) {
    return ''
  }

  return md5(email)
}

export const getGravatarUrl = (email, size = 160) => {
  if (!email) {
    return ''
  }

  const hash = md5(`${email}`.trim().toLowerCase())
  return `https://gravatar.com/avatar/${hash}?s=${size}&d=mp`
}

export const getGravatarUrlByHash = (hash, size = 160) => {
  if (!hash) {
    return ''
  }

  return `https://gravatar.com/avatar/${`${hash}`
    .trim()
    .toLowerCase()}?s=${size}&d=mp`
}

export const getSiteAvatarUrl = NOTION_CONFIG => {
  return siteConfig('AVATAR', null, NOTION_CONFIG) || ''
}

export const getAuthorAvatarUrl = (NOTION_CONFIG, size = 160) => {
  return (
    getGravatarUrlByHash(getSiteEmailHash(NOTION_CONFIG), size) ||
    getGravatarUrl(getSiteEmail(NOTION_CONFIG), size) ||
    getSiteAvatarUrl(NOTION_CONFIG)
  )
}
