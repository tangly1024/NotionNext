import { splitSpeakable } from './aiTextUtils';

/**
 * 更稳的流式大模型请求服务
 * 兼容更多返回格式，避免一直“思考中”
 */
export async function streamChatCompletion({
  settings,
  messages,
  signal,
  onStart,
  onUpdate,
  onSentence,
  onFinished,
  onError
}) {
  if (!settings?.apiKey) {
    onError?.(new Error('请先配置 API Key'));
    return;
  }

  try {
    onStart?.();

    const url = `${String(settings.apiUrl || '').replace(/\/+$/, '')}/chat/completions`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`
      },
      signal,
      body: JSON.stringify({
        model: settings.model,
        temperature: settings.temperature,
        stream: true,
        messages
      })
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    if (!res.body) {
      throw new Error('API 返回为空');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let raw = '';
    let fullText = '';
    let sentenceBuffer = '';

    const pushChunk = (chunk) => {
      if (!chunk) return;

      fullText += chunk;
      sentenceBuffer += chunk;

      onUpdate?.(fullText);

      const { sentences, rest } = splitSpeakable(sentenceBuffer);
      if (sentences.length) {
        for (const s of sentences) {
          if (!signal?.aborted) onSentence?.(s);
        }
        sentenceBuffer = rest;
      }
    };

    while (true) {
      if (signal?.aborted) break;

      const { done, value } = await reader.read();
      if (done) break;

      raw += decoder.decode(value, { stream: true });

      // 兼容 \r\n
      const parts = raw.split(/\r?\n/);
      raw = parts.pop() || '';

      for (const line of parts) {
        if (signal?.aborted) break;

        const ln = line.trim();
        if (!ln) continue;
        if (!ln.startsWith('data:')) continue;

        const payload = ln.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;

        try {
          const data = JSON.parse(payload);

          // 兼容多种 chunk 格式
          const chunk =
            data?.choices?.[0]?.delta?.content ||
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.text ||
            data?.delta?.content ||
            data?.text ||
            '';

          pushChunk(chunk);
        } catch (_) {
          // 忽略单条坏数据
        }
      }
    }

    // 如果最后 raw 里还有一个完整 data，也尝试再吃一次
    const tail = raw.trim();
    if (tail.startsWith('data:')) {
      const payload = tail.slice(5).trim();
      if (payload && payload !== '[DONE]') {
        try {
          const data = JSON.parse(payload);
          const chunk =
            data?.choices?.[0]?.delta?.content ||
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.text ||
            data?.delta?.content ||
            data?.text ||
            '';
          pushChunk(chunk);
        } catch (_) {}
      }
    }

    if (sentenceBuffer.trim() && !signal?.aborted) {
      onSentence?.(sentenceBuffer.trim());
    }

    if (!signal?.aborted) {
      onFinished?.(fullText);
    }
  } catch (e) {
    if (e?.name !== 'AbortError') {
      onError?.(e);
    }
  }
}
