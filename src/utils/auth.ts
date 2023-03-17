import { sha256 } from 'js-sha256'
interface AuthPayload {
  t: number
  m: string
}

async function digestMessage(message: string) {
  if (crypto && crypto.subtle && crypto.subtle.digest) {
    const msgUint8 = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } else {
    return sha256(message).toString()
  }
}

export const generateSignature = async (payload: AuthPayload) => {
  const { t: timestamp, m: lastMessage } = payload
  const secretKey = import.meta.env.PUBLIC_SECRET_KEY as string
  const signText = `${timestamp}:${lastMessage}:${secretKey}`
  return await digestMessage(signText)
}

export const verifySignature = async (payload: AuthPayload, sign: string) => {
  // if (Math.abs(payload.t - Date.now()) > 1000 * 60 * 5) {
  //   return false
  // }
  const payloadSign = await generateSignature(payload)
  return payloadSign === sign
}
