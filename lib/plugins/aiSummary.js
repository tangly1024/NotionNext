/**
 * get Ai summary
 * @returns {Promise<string>}
 * @param aiSummaryAPI
 * @param aiSummaryKey
 * @param truncatedText
 */
export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText) {
  try {
    console.log('请求文章摘要', truncatedText.slice(0, 100))
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
    return null
  }
}
