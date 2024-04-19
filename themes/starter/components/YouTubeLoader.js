import React, { useState } from 'react';
import LazyImage from '@/components/LazyImage'

function YouTubeLoader({ width = '844px', height = '467px',imgPath = '/images/madeeasy.jpg',videoURL }) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  const loadVideo = () => {
    setVideoLoaded(true);
  };

  videoURL = videoURL + "?&autoplay=1";

  return (

    <>
     {!videoLoaded && <button onClick={loadVideo}><LazyImage  alt={'youtube video'} width={width} height={height} src={imgPath}></LazyImage></button>}
     {videoLoaded &&
        <iframe
        id="responsive-iframe"
        loading="lazy"
        src={videoURL}
        width={width}
        height={height}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        
      ></iframe>
      }
      

    </>
  );
}

export default YouTubeLoader;
