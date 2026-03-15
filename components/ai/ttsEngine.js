import { sanitizeForTTS, splitMixedLanguage } from './aiTextUtils';
import { toFinite } from './aiConfig';

export class ExternalTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.currentAudio = null;
    this.playToken = 0;
    this.settingsRef = null;
    this.onStateChange = null;
    this.audioUnlocked = false;
    this.prefetching = false;
    this.prefetchAudio = null;
    this.prefetchToken = null;
    this.recentSegments = [];
  }

  setSettingsRef(ref) {
    this.settingsRef = ref;
  }

  setStateCallback(cb) {
    this.onStateChange = cb;
  }

  unlockAudio() {
    if (this.audioUnlocked || typeof Audio === 'undefined') return;
    try {
      const audio = new Audio('data:audio/mp3;base64,//MkxAAQAAAAgAAAAAAAAAAAAAAP//AwAAAAAAAAAAAAA=');
      audio.play().then(() => {
        this.audioUnlocked = true;
      }).catch(() => {});
    } catch {}
  }

  emitState() {
    this.onStateChange?.({ isPlaying: this.isPlaying });
  }

  sanitizeText(text) {
    return sanitizeForTTS(text);
  }

  getVoiceForLang(lang) {
    const settings = this.settingsRef || {};
    if (lang === 'my') return 'my-MM-NilarNeural';
    if (lang === 'en') return 'en-US-JennyNeural';
    return settings.ttsVoice || 'zh-CN-XiaoxiaoMultilingualNeural';
  }

  buildUrl(text, voice) {
    const settings = this.settingsRef || {};
    const rate = toFinite(settings.ttsSpeed, 0);
    const pitch = toFinite(settings.ttsPitch, 0);
    const baseUrl = settings.ttsApiUrl || 'https://t.leftsite.cn/tts';
    return `${baseUrl}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${encodeURIComponent(rate)}&p=${encodeURIComponent(pitch)}`;
  }

  seenRecently(key) {
    const now = Date.now();
    this.recentSegments = this.recentSegments.filter((item) => now - item.t < 2500);
    if (this.recentSegments.some((item) => item.k === key)) return true;
    this.recentSegments.push({ k: key, t: now });
    return false;
  }

  push(text) {
    const clean = this.sanitizeText(text || '');
    if (!clean) return;

    const segments = splitMixedLanguage(clean);
    for (const seg of segments) {
      const segText = seg.text.trim();
      if (!segText) continue;
      const key = `${seg.lang}:${segText.toLowerCase()}`;
      if (this.seenRecently(key)) continue;
      this.queue.push({ text: segText, voice: this.getVoiceForLang(seg.lang) });
    }

    if (this.queue.length === 0) return;

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.emitState();
      this.playNext();
    }

    this.prefetchNext();
  }

  prefetchNext() {
    if (typeof Audio === 'undefined') return;
    if (this.prefetching || this.prefetchAudio || this.queue.length === 0) return;

    const nextItem = this.queue[0];
    const token = this.playToken;
    const audio = new Audio(this.buildUrl(nextItem.text, nextItem.voice));

    this.prefetching = true;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.oncanplaythrough = () => {
      if (token !== this.playToken) return;
      this.prefetchAudio = audio;
      this.prefetchToken = token;
      this.prefetching = false;
    };
    audio.onerror = () => {
      this.prefetching = false;
    };

    audio.load();
  }

  playNext() {
    if (typeof Audio === 'undefined') {
      this.isPlaying = false;
      this.emitState();
      return;
    }

    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.emitState();
      return;
    }

    const token = this.playToken;
    const item = this.queue.shift();
    const expectedUrl = this.buildUrl(item.text, item.voice);

    let audio = null;
    if (
      this.prefetchAudio &&
      this.prefetchToken === token &&
      this.prefetchAudio.src === expectedUrl
    ) {
      audio = this.prefetchAudio;
      this.prefetchAudio = null;
      this.prefetchToken = null;
    } else {
      audio = new Audio(expectedUrl);
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
    }

    this.currentAudio = audio;

    const onEndOrError = () => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      if (this.queue.length > 0) {
        this.playNext();
      } else {
        this.isPlaying = false;
        this.emitState();
      }
    };

    audio.onended = onEndOrError;
    audio.onerror = onEndOrError;
    audio.play().catch(onEndOrError);
    this.prefetchNext();
  }

  stopAndClear() {
    this.playToken += 1;
    this.queue = [];
    this.recentSegments = [];

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.removeAttribute('src');
      this.currentAudio.load();
      this.currentAudio = null;
    }

    if (this.prefetchAudio) {
      this.prefetchAudio.pause();
      this.prefetchAudio.removeAttribute('src');
      this.prefetchAudio.load();
      this.prefetchAudio = null;
    }

    this.prefetching = false;
    this.prefetchToken = null;
    this.isPlaying = false;
    this.emitState();
  }
}

export const ttsEngine = new ExternalTTSQueue();
