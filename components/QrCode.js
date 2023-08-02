import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 二维码生成
 */
export default function QrCode({ value }) {
  useEffect(() => {
    let qrcode
    if (!value) {
      return
    }
    loadExternalResource(BLOG.QR_CODE_CDN, 'js').then(url => {
      const QRCode = window.QRCode
      qrcode = new QRCode(document.getElementById('qrcode'), {
        text: value,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.log('二维码', qrcode, value)
    })
    return () => {
      if (qrcode) {
        qrcode.clear() // clear the code.
      }
    }
  }, [])

  return <div id="qrcode"></div>
}
