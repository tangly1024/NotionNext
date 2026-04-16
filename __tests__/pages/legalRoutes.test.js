const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const path = require('path')

test('privacy policy route source exists and exports getStaticProps', () => {
  const filePath = path.join(process.cwd(), 'pages', 'privacy-policy.js')

  assert.equal(fs.existsSync(filePath), true)
  assert.match(fs.readFileSync(filePath, 'utf8'), /getStaticProps/)
})

test('terms of service route source exists and exports getStaticProps', () => {
  const filePath = path.join(process.cwd(), 'pages', 'terms-of-service.js')

  assert.equal(fs.existsSync(filePath), true)
  assert.match(fs.readFileSync(filePath, 'utf8'), /getStaticProps/)
})
