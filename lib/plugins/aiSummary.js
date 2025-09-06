/**
 * get Ai summary
 * @returns {Promise<string>}
 * @param aiSummaryAPI
 * @param aiSummaryKey
 * @param truncatedText
 */
export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText) {  
  try {  
    console.log('请求文章摘要', truncatedText.slice(0, 50))  
    const response = await fetch(aiSummaryAPI, {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${aiSummaryKey}`  
      },  
      body: JSON.stringify({  
        model: "deepseek-chat",  
        messages: [  
          {  
            role: "system",  
            content: "请阅读以下博客文章，提炼其核心内容，并生成一段简洁、清晰的摘要。\n要求：\n1. 概括主要观点：突出作者的核心想法和关键结论；\n2. 保留文章结构：如有明显的引入、过程、结论，尽量反映出来；\n3. 风格自然：语言流畅，略带博客口吻，但不过度口语化；\n4. 字数建议：控制在 80～100 字之间；\n5. 不要返回markdown格式；\n6. 请确保在生成的内容中，中文与英文、数字之间添加空格；\n7. 请以这里是AI，这篇文章介绍了开头。\n\n"
          },  
          {  
            role: "user",   
            content: truncatedText  
          }  
        ],  
        max_tokens: 200,  
        temperature: 0.7  
      })  
    })  
  
    if (response.ok) {  
      const data = await response.json()  
      return data.choices[0].message.content  
    } else {  
      throw new Error('Response not ok')  
    }  
  } catch (error) {  
    console.error('DeepSeek API请求失败', error)  
    return '获取文章摘要失败，请稍后再试。'  
  }  
}
