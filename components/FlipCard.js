import React from 'react'

/**
 * 翻转组件
 * @param {*} props
 * @returns
 */
export default function FlipCard(props) {
  return (
    <div className='flip-card'>
      <div className='flip-card-inner'>
        <div className={`flip-card-front ${props.className || ''}`}>
          {props.frontContent}
        </div>
        <div className={`flip-card-back ${props.className || ''}`}>
          {props.backContent}
        </div>
      </div>
      <style jsx>{`
        .flip-card {
          width: 100%;
          height: 100%;
          display: inline-block;
          position: relative;
          perspective: 1200px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .flip-card-front {
          z-index: 2;
          transform: rotateY(0);
          pointer-events: auto;
        }

        .flip-card-back {
          transform: rotateY(180deg);
          pointer-events: none;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card:hover .flip-card-front {
          pointer-events: none;
        }

        .flip-card:hover .flip-card-back {
          pointer-events: auto;
        }
      `}</style>
    </div>
  )
}
