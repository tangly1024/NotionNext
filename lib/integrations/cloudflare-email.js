const EMAIL_API_BASE = 'https://api.cloudflare.com/client/v4'

function normalizeEnv(value) {
  return typeof value === 'string'
    ? value.replace(/\\n/g, '').trim()
    : value
}

function getEmailConfig() {
  return {
    accountId: normalizeEnv(process.env.CLOUDFLARE_EMAIL_ACCOUNT_ID),
    apiToken: normalizeEnv(process.env.CLOUDFLARE_EMAIL_API_TOKEN),
    fromEmail: normalizeEnv(process.env.CLOUDFLARE_EMAIL_FROM_EMAIL),
    fromName:
      normalizeEnv(process.env.CLOUDFLARE_EMAIL_FROM_NAME) || 'CharliiAI',
    replyTo:
      normalizeEnv(process.env.CLOUDFLARE_EMAIL_REPLY_TO) ||
      normalizeEnv(process.env.CLOUDFLARE_EMAIL_FROM_EMAIL),
    ownerEmail:
      normalizeEnv(process.env.LEAD_OWNER_EMAIL) ||
      normalizeEnv(process.env.RESEND_FORWARD_TO) ||
      'kenchikuliu@outlook.com'
  }
}

function hasCloudflareEmailConfig(config = getEmailConfig()) {
  return Boolean(
    config.accountId &&
      config.apiToken &&
      config.fromEmail &&
      config.replyTo
  )
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmailShell({
  eyebrow,
  title,
  bodyHtml,
  footerHtml = '',
  accent = '#22d3ee'
}) {
  return `
    <div style="margin:0;padding:32px 16px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,0.08);">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#0f172a,#1d4ed8 58%,#0f766e);color:#ffffff;">
          <div style="display:inline-block;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.16);font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">
            ${escapeHtml(eyebrow)}
          </div>
          <h1 style="margin:16px 0 0;font-size:28px;line-height:1.2;font-weight:800;">${escapeHtml(
            title
          )}</h1>
        </div>
        <div style="padding:32px;">
          ${bodyHtml}
          ${
            footerHtml
              ? `<div style="margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;color:#475569;font-size:13px;line-height:1.7;">${footerHtml}</div>`
              : ''
          }
        </div>
        <div style="height:6px;background:${accent};"></div>
      </div>
    </div>
  `
}

async function sendCloudflareEmail({
  to,
  subject,
  html,
  text,
  headers,
  replyTo
}) {
  const config = getEmailConfig()
  if (!hasCloudflareEmailConfig(config)) {
    throw new Error('Cloudflare Email Service is not configured')
  }

  const response = await fetch(
    `${EMAIL_API_BASE}/accounts/${config.accountId}/email/sending/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        from: {
          address: config.fromEmail,
          name: config.fromName
        },
        reply_to: replyTo || config.replyTo,
        subject,
        html,
        text,
        headers
      })
    }
  )

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.success) {
    const firstError = data?.errors?.[0]
    throw new Error(
      firstError?.message ||
        `Cloudflare email send failed with status ${response.status}`
    )
  }

  return data.result
}

function buildLeadOwnerEmail({ lead }) {
  const siteUrl = process.env.NEXT_PUBLIC_LINK || 'https://www.charliiai.com'
  const source = lead.source || 'homepage_cta'
  const details = [
    ['Email', lead.email],
    ['Source', source],
    ['Locale', lead.locale || 'unknown'],
    ['Page URL', lead.pageUrl || siteUrl],
    ['Referrer', lead.referrer || 'direct/unknown'],
    ['IP', lead.ip || 'unknown'],
    ['User Agent', lead.userAgent || 'unknown'],
    ['Submitted At', lead.submittedAt]
  ]

  const htmlRows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;">${escapeHtml(
          label
        )}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join('')

  return {
    to: getEmailConfig().ownerEmail,
    subject: `New CharliiAI lead: ${lead.email}`,
    html: buildEmailShell({
      eyebrow: 'Lead Alert',
      title: 'A new CharliiAI CTA lead just came in',
      bodyHtml: `
        <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#334155;">
          The homepage CTA form collected a new lead. Key details are below.
        </p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.6;">${htmlRows}</table>
        <div style="margin-top:20px;">
          <a href="${escapeHtml(
            lead.pageUrl || siteUrl
          )}" style="display:inline-block;padding:12px 18px;border-radius:14px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;">
            Open source page
          </a>
        </div>
      `,
      footerHtml: `
        Submitted from <a href="${escapeHtml(
          siteUrl
        )}" style="color:#0f766e;text-decoration:none;">${escapeHtml(
        siteUrl
      )}</a>.<br />
        This notification was generated by the CharliiAI lead pipeline.
      `
    }),
    text: details.map(([label, value]) => `${label}: ${value}`).join('\n')
  }
}

function buildLeadUserConfirmationEmail({ lead }) {
  const siteUrl = process.env.NEXT_PUBLIC_LINK || 'https://www.charliiai.com'
  const unsubscribeUrl = `${siteUrl.replace(/\/$/, '')}/contact`
  const contactUrl = `${siteUrl.replace(/\/$/, '')}/contact`
  const isZh = lead.locale === 'zh-CN'

  return {
    to: lead.email,
    subject:
      isZh
        ? '已收到你的订阅申请 | CharliiAI'
        : 'We received your subscription request | CharliiAI',
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`
    },
    html: buildEmailShell({
      eyebrow: isZh ? '订阅确认' : 'Subscription Confirmed',
      title: isZh
        ? '你已经加入 CharliiAI 更新名单'
        : 'You are now on the CharliiAI update list',
      bodyHtml: isZh
        ? `
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#334155;">
            已收到你的邮箱：<strong>${escapeHtml(lead.email)}</strong>。
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#334155;">
            后续我会优先发送 AI 实战、自动化工作流、工具拆解，以及适合独立开发者和内容创作者的落地案例。
          </p>
          <div style="margin:20px 0;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0891b2;">你会收到什么</div>
            <ul style="margin:12px 0 0 18px;padding:0;color:#334155;line-height:1.8;">
              <li>新的 AI 工作流与自动化实践</li>
              <li>工具拆解、案例复盘、选题趋势</li>
              <li>合作与咨询相关更新</li>
            </ul>
          </div>
          <div style="margin-top:20px;">
            <a href="${escapeHtml(
              contactUrl
            )}" style="display:inline-block;padding:12px 18px;border-radius:14px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;">
              打开联系页
            </a>
          </div>
        `
        : `
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#334155;">
            I received your email: <strong>${escapeHtml(lead.email)}</strong>.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#334155;">
            I will send future updates on AI workflows, automation systems, tool breakdowns, and practical implementation notes for builders and operators.
          </p>
          <div style="margin:20px 0;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0891b2;">What to expect</div>
            <ul style="margin:12px 0 0 18px;padding:0;color:#334155;line-height:1.8;">
              <li>New AI workflows and automation patterns</li>
              <li>Tool breakdowns, case studies, and search-driven topics</li>
              <li>Collaboration and consulting updates</li>
            </ul>
          </div>
          <div style="margin-top:20px;">
            <a href="${escapeHtml(
              contactUrl
            )}" style="display:inline-block;padding:12px 18px;border-radius:14px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;">
              Open contact page
            </a>
          </div>
        `,
      footerHtml: isZh
        ? `如果你现在就有具体需求，直接回复这封邮件或访问 <a href="${escapeHtml(
            contactUrl
          )}" style="color:#0f766e;text-decoration:none;">联系页</a> 即可。`
        : `If you already have a concrete use case, reply to this email or use the <a href="${escapeHtml(
            contactUrl
          )}" style="color:#0f766e;text-decoration:none;">contact page</a>.`
    }),
    text:
      isZh
        ? `谢谢，你已加入 CharliiAI 更新名单。\n我们已收到你的邮箱：${lead.email}\n后续你会收到 AI 实战、自动化工作流、工具拆解和合作相关更新。\n联系页：${contactUrl}`
        : `You are on the CharliiAI update list.\nWe received your email: ${lead.email}\nYou will receive AI workflows, automation notes, tool breakdowns, and collaboration updates.\nContact: ${contactUrl}`
  }
}

export {
  buildLeadOwnerEmail,
  buildLeadUserConfirmationEmail,
  getEmailConfig,
  hasCloudflareEmailConfig,
  sendCloudflareEmail
}
