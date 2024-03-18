/* eslint-disable @next/next/no-img-element */

import Image from 'next/image'

/**
 * 全屏按钮
 * @returns
 */
export default function FullScreen() {
  function toggleFullScreen() {
    // window.scrollTo(0, 2)
    document?.querySelector('#game-wrapper')?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
    // console.log(document?.getElementById('game-wrapper')?.contentWindow)
    document?.getElementById('game-wrapper')?.contentWindow?.toggleFullScreen()
  }

  return (
    <div
      className="group text-white w-full justify-center items-center flex rounded-lg m-2 md:m-0 p-2 hover:bg-gray-700 bg-[#1F2030] md:rounded-none md:bg-none"
      onClick={toggleFullScreen}
    >
      <Image
        width={18}
        height={18}
        src="/svg/fullscreen-alt.svg"
        alt="full screen"
        title="full screen"
        className="cursor-pointer group-hover:scale-125 transition-all duration-150 "
      />
      <span className="h-full flex mx-2 md:hidden items-center select-none">
        FullScreen
      </span>
    </div>
  )
}
