/**
 * 客户端接口
 * @param {*} input
 * @param {*} firstName
 * @param {*} lastName
 * @returns
 */
export async function subscribeToNewsletter(input, firstName, lastName) {
  const payload =
    typeof input === 'string'
      ? { email: input, first_name: firstName, last_name: lastName }
      : input

  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const data = await response.json()
  return data
}
