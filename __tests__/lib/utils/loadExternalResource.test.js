import { loadExternalResource } from '@/lib/utils'

describe('loadExternalResource', () => {
  afterEach(() => {
    document.head
      .querySelectorAll('[data-test-resource]')
      .forEach(tag => tag.remove())
  })

  it('waits for an existing script to finish loading', async () => {
    const url = '/js/typed.min.js'
    const first = loadExternalResource(url, 'js')
    const script = document.head.querySelector(`script[src='${url}']`)
    script.dataset.testResource = 'true'

    const second = loadExternalResource(url, 'js')
    let settled = false
    second.then(() => {
      settled = true
    })
    await Promise.resolve()
    expect(settled).toBe(false)
    expect(document.head.querySelectorAll(`script[src='${url}']`)).toHaveLength(
      1
    )

    script.dispatchEvent(new Event('load'))
    await expect(first).resolves.toBe(url)
    await expect(second).resolves.toBe(url)
    await expect(loadExternalResource(url, 'js')).resolves.toBe(url)
  })

  it('removes a failed script so a later call can retry', async () => {
    const url = '/js/retry.js'
    const first = loadExternalResource(url, 'js')
    const script = document.head.querySelector(`script[src='${url}']`)
    script.dataset.testResource = 'true'
    script.dispatchEvent(new Event('error'))
    await expect(first).rejects.toBe(url)
    expect(script.isConnected).toBe(false)

    const retry = loadExternalResource(url, 'js')
    const newScript = document.head.querySelector(`script[src='${url}']`)
    newScript.dataset.testResource = 'true'
    expect(newScript).not.toBe(script)
    newScript.dispatchEvent(new Event('load'))
    await expect(retry).resolves.toBe(url)
  })
})
