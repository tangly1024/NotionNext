/** @jest-environment node */
import {
  allowPasswordAttempt,
  isSameOriginRequest
} from '@/lib/server/requestSecurity'

const oldTrustProxy = process.env.TRUST_PROXY
const oldVercel = process.env.VERCEL
beforeEach(() => {
  delete process.env.TRUST_PROXY
  delete process.env.VERCEL
})
afterAll(() => {
  if (oldTrustProxy === undefined) delete process.env.TRUST_PROXY
  else process.env.TRUST_PROXY = oldTrustProxy
  if (oldVercel === undefined) delete process.env.VERCEL
  else process.env.VERCEL = oldVercel
})
const request = (ip = '192.0.2.1') => ({
  headers: { host: 'example.com', origin: 'https://example.com' },
  socket: { remoteAddress: ip, encrypted: true }
})

it('keeps a 20-attempt fixed window and expires it after one minute', () => {
  const req = request('fixed-window')
  for (let i = 0; i < 20; i++) expect(allowPasswordAttempt(req, 0)).toBe(true)
  expect(allowPasswordAttempt(req, 59999)).toBe(false)
  expect(allowPasswordAttempt(req, 60000)).toBe(true)
})

it('evicts the oldest window at capacity without blocking all new visitors', () => {
  const first = request('oldest-window')
  for (let i = 0; i < 20; i++) allowPasswordAttempt(first, 120000)
  for (let i = 0; i < 9999; i++) {
    expect(allowPasswordAttempt(request(`2001:db8::${i}`), 120001)).toBe(true)
  }
  expect(allowPasswordAttempt(first, 120002)).toBe(false)
  expect(allowPasswordAttempt(request('new-visitor'), 120003)).toBe(true)
  expect(allowPasswordAttempt(first, 120004)).toBe(true)
})

it('ignores spoofed IP headers unless a trusted proxy is configured', () => {
  const req = request('untrusted-forwarding')
  for (let i = 0; i < 20; i++) {
    req.headers['x-forwarded-for'] = `spoof-${i}`
    expect(allowPasswordAttempt(req, 240000)).toBe(true)
  }
  req.headers['x-forwarded-for'] = 'spoof-new'
  expect(allowPasswordAttempt(req, 240000)).toBe(false)
  process.env.TRUST_PROXY = 'true'
  expect(allowPasswordAttempt(req, 240000)).toBe(true)
})

it('compares the full origin for direct TLS and HTTP requests', () => {
  expect(isSameOriginRequest(request())).toBe(true)
  const req = request()
  req.socket.encrypted = false
  expect(isSameOriginRequest(req)).toBe(false)
  req.headers.origin = 'http://example.com'
  expect(isSameOriginRequest(req)).toBe(true)
})

it.each(['proxy', 'vercel'])(
  'honors externally visible origin behind a trusted %s',
  mode => {
    if (mode === 'proxy') process.env.TRUST_PROXY = 'true'
    else process.env.VERCEL = '1'
    const req = request()
    req.socket.encrypted = false
    req.headers.host = 'upstream:3000'
    req.headers['x-forwarded-host'] = 'example.com:8443'
    req.headers['x-forwarded-proto'] = 'https'
    req.headers.origin = 'https://example.com:8443'
    expect(isSameOriginRequest(req)).toBe(true)
    req.headers.origin = 'https://attacker.invalid'
    expect(isSameOriginRequest(req)).toBe(false)
  }
)

it('rejects forged forwarded hosts on direct requests', () => {
  const req = request()
  req.headers.origin = 'https://attacker.invalid'
  req.headers['x-forwarded-host'] = 'attacker.invalid'
  req.headers['x-forwarded-proto'] = 'https'
  expect(isSameOriginRequest(req)).toBe(false)
})

it.each([
  'example.com, attacker.invalid',
  ['example.com'],
  'user@example.com',
  'example.com/path'
])('rejects ambiguous trusted forwarded hosts: %s', host => {
  process.env.TRUST_PROXY = 'true'
  const req = request()
  req.headers['x-forwarded-host'] = host
  expect(isSameOriginRequest(req)).toBe(false)
})

it.each([
  'null',
  'https://example.com/path',
  'https://example.com.attacker.invalid',
  ['https://example.com']
])('rejects malformed or foreign origins: %s', origin => {
  const req = request()
  req.headers.origin = origin
  expect(isSameOriginRequest(req)).toBe(false)
})
