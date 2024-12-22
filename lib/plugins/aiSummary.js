/**
 * get Ai summary
 * @returns {Promise<string>}
 * @param aiSummaryAPI
 * @param aiSummaryKey
 * @param truncatedText
 */
export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText) {
  try {
    const response = await fetch(aiSummaryAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: aiSummaryKey,
        content: truncatedText
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.summary
    } else {
      throw new Error('Response not ok')
    }
  } catch (error) {
    console.error('ChucklePostAI：请求失败', error)
    return '获取文章摘要失败，请稍后再试。'
  }
}
