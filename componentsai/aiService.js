import { splitSpeakable } from './aiTextUtils';

/**
 * 纯净的大模型流式请求服务 (复用于口语、选择题、短句练习等所有场景)
 */
export async function streamChatCompletion({
  settings,
  messages,
  signal,
  onStart,     // 开始思考时触发
  onUpdate,    // 收到文字更新时触发 (传入最新完整可见文本)
  onSentence,  // 分句完成时触发 (可对接 TTS)
  onFinished,  // 结束时触发
  onError      // 报错时触发
}) {
  if (!settings.apiKey) {
    onError?.(new Error('请先配置 API Key'));
    return;
  }

  try {
    onStart?.();
    const res = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
      signal: signal,
      body: JSON.stringify({
        model: settings.model,
        temperature: settings.temperature,
        stream: true,
        messages,
      }),
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let raw = '';
    let fullText = '';
    let sentenceBuffer = '';

    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;

      raw += decoder.decode(value, { stream: true });
      const parts = raw.split('\n');
      raw = parts.pop() || '';

      for (const line of parts) {
        if (signal?.aborted) break;
        const ln = line.trim();
        if (!ln.startsWith('data:')) continue;
        const payload = ln.slice(5).trim();
        if (payload === '[DONE]') continue;

        try {
          const data = JSON.parse(payload);
          const chunk = data.choices?.[0]?.delta?.content || '';
          if (!chunk) continue;

          fullText += chunk;
          sentenceBuffer += chunk;

          // 更新完整可见文本给UI
          onUpdate?.(fullText);

          // 执行分句并抛出给 TTS
          const { sentences, rest } = splitSpeakable(sentenceBuffer);
          if (sentences.length) {
            for (const s of sentences) {
              if (!signal?.aborted) onSentence?.(s);
            }
            sentenceBuffer = rest;
          }
        } catch {}
      }
    }

    if (sentenceBuffer.trim() && !signal?.aborted) {
      onSentence?.(sentenceBuffer.trim());
    }
    
    if (!signal?.aborted) onFinished?.(fullText);

  } catch (e) {
    if (e.name !== 'AbortError') {
      onError?.(e);
    }
  }
}
