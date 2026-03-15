import { getProviderById } from './aiProviders';

function buildChatEndpoint(settings) {
  const provider = getProviderById(settings?.providerId);
  const baseUrl = String(settings?.apiUrl || provider?.baseUrl || '').replace(/\/+$/, '');
  return `${baseUrl}/chat/completions`;
}

function buildHeaders(settings) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${settings?.apiKey || ''}`
  };

  if (settings?.providerId === 'openrouter' && typeof window !== 'undefined') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'AI Tutor';
  }

  return headers;
}

function extractTextChunk(data) {
  return (
    data?.choices?.[0]?.delta?.content ||
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.delta?.content ||
    data?.text ||
    ''
  );
}

export async function streamChatCompletion({
  settings,
  messages,
  signal,
  onStart,
  onUpdate,
  onFinished,
  onError
}) {
  if (!settings?.apiKey) {
    onError?.(new Error('请先填写 API Key'));
    return;
  }

  if (!settings?.model) {
    onError?.(new Error('请先选择模型'));
    return;
  }

  try {
    onStart?.();

    const response = await fetch(buildChatEndpoint(settings), {
      method: 'POST',
      headers: buildHeaders(settings),
      signal,
      body: JSON.stringify({
        model: settings.model,
        temperature: settings.temperature,
        stream: true,
        messages
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('API 返回为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let raw = '';
    let fullText = '';

    while (true) {
      if (signal?.aborted) break;

      const { done, value } = await reader.read();
      if (done) break;

      raw += decoder.decode(value, { stream: true });
      const parts = raw.split(/\r?\n/);
      raw = parts.pop() || '';

      for (const line of parts) {
        if (signal?.aborted) break;

        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;

        try {
          const data = JSON.parse(payload);
          const chunk = extractTextChunk(data);
          if (!chunk) continue;
          fullText += chunk;
          onUpdate?.(fullText);
        } catch {}
      }
    }

    const tail = raw.trim();
    if (tail.startsWith('data:')) {
      const payload = tail.slice(5).trim();
      if (payload && payload !== '[DONE]') {
        try {
          const data = JSON.parse(payload);
          const chunk = extractTextChunk(data);
          if (chunk) {
            fullText += chunk;
            onUpdate?.(fullText);
          }
        } catch {}
      }
    }

    if (!signal?.aborted) {
      onFinished?.(fullText);
    }
  } catch (error) {
    if (error?.name !== 'AbortError') {
      onError?.(error);
    }
  }
}
