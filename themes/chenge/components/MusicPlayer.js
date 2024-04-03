import React, { useEffect, useRef, useState } from 'react';
import CONFIG from '../config';
import { siteConfig } from '@/lib/config';
import { loadExternalResource } from '@/lib/utils';

const MusicPlayer = () => {
  const [player, setPlayer] = useState(null);
  const ref = useRef(null);
  const order = siteConfig('MUSIC_PLAYER_ORDER');
  // const autoPlay = siteConfig('MUSIC_PLAYER_AUTOPLAY', false, CONFIG);
  const audioConfig = siteConfig('MUSIC_PLAYER_AUDIO_LIST');
  let audio;

  try {
    audio = typeof audioConfig === 'string' ? JSON.parse(audioConfig) : audioConfig;
  } catch (error) {
    console.error('解析音乐播放列表出错:', error);
    audio = [];
  }

  const initMusicPlayer = async () => {
    if (window.mediaPlayer) {
      try {
        const config = {
          type: 'audio',
          mode: order,
        };
        // 初始化 mediaPlayer 并获取返回值 t
        const t = window.mediaPlayer(ref.current, config);
        // 由于 mediaPlayer 函数返回的是 t，播放器实例实际上位于 t.player
        // 现在使用 t.player.load 方法加载音频列表
        if(t && t.player && typeof t.player.load === 'function') {
          t.player.load(audio); // 这样调用不会报错
        } else {
          console.error('播放器加载函数不存在');
        }
      } catch (error) {
        console.error('音乐播放器加载异常', error);
      }
    }
  };
  

  useEffect(() => {
    const loadResourcesAndInitPlayer = async () => {
      if (!document.querySelector('link[href="/css/player.css"]')) {
        loadExternalResource('/css/player.css', 'css');
      }
      if (!document.querySelector('script[src="/js/mediaPlayer.js"]')) {
        await loadExternalResource('/js/mediaPlayer.js', 'js');
      }
      initMusicPlayer();
    };

    loadResourcesAndInitPlayer();

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, []);

  if (!siteConfig('MUSIC_PLAYER', null, CONFIG)) {
    return <></>;
  } else {
    return (
      <div ref={ref} className="item player">
        {/* 播放器容器，mediaPlayer将在这个元素内进行初始化 */}
      </div>
    );
  }
};

export default MusicPlayer;
