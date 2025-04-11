export const handleEmailClick = (e, emailIcon, CONTACT_EMAIL) => {
  if (CONTACT_EMAIL && emailIcon && !emailIcon.current.href) {
    e.preventDefault()
    try {
      const email = decodeURIComponent(escape(atob(CONTACT_EMAIL)))
      emailIcon.current.href = `mailto:${email}`
      emailIcon.current.click()
    } catch (error) {
      console.error('解密邮箱失败:', error)
    }
  }
}
