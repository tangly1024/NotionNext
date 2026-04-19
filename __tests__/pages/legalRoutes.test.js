const fs = require('fs')
const path = require('path')

test('privacy policy route source exists and exports getStaticProps', () => {
  const filePath = path.join(process.cwd(), 'pages', 'privacy-policy.js')

  expect(fs.existsSync(filePath)).toBe(true)
  expect(fs.readFileSync(filePath, 'utf8')).toMatch(/getStaticProps/)
})

test('terms of service route source exists and exports getStaticProps', () => {
  const filePath = path.join(process.cwd(), 'pages', 'terms-of-service.js')

  expect(fs.existsSync(filePath)).toBe(true)
  expect(fs.readFileSync(filePath, 'utf8')).toMatch(/getStaticProps/)
})

test('about route source exists and exports getStaticProps', () => {
  const filePath = path.join(process.cwd(), 'pages', 'about.js')

  expect(fs.existsSync(filePath)).toBe(true)
  expect(fs.readFileSync(filePath, 'utf8')).toMatch(/getStaticProps/)
})

test('contact route source exists and exports getStaticProps', () => {
  const filePath = path.join(process.cwd(), 'pages', 'contact.js')

  expect(fs.existsSync(filePath)).toBe(true)
  expect(fs.readFileSync(filePath, 'utf8')).toMatch(/getStaticProps/)
})
