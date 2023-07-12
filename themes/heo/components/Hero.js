// import Image from 'next/image'

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  return (
        <>
            <notice className="max-w-[88rem] w-full mx-auto flex h-12 mb-4 px-5 font-bold">
                <div className="bg-white rounded-xl border w-full h-full flex items-center justify-between px-5">
                    <div>左侧 图表</div>
                    <div className="w-full h-full hover:text-indigo-600 flex justify-center items-center">这里是公告栏</div>
                    <div>右侧按钮</div>
                </div>
            </notice>

            <hero id="hero" style={{ zIndex: 1 }} className="max-w-[88rem] w-full mx-auto flex relative space-x-3 px-5" >
                <div id='hero-left' className='flex flex-col flex-1 bg-red-200'>
                    <div className="h-60 bg-white rounded-xl border my-2"></div>
                    <div className="h-20 flex flex-nowrap justify-between space-x-3 my-2">
                        <div className="bg-white rounded-xl border flex-1">

                        </div>
                        <div className="bg-white rounded-xl border flex-1">

                        </div>
                        <div className="bg-white rounded-xl border flex-1">

                        </div>
                    </div>
                </div>
                <div id='hero-right' className='flex flex-col flex-1 bg-green-200 '>
                    <div className="my-2 h-full bg-white rounded-xl border "></div>

                </div>
            </hero>

        </>
  )
}

export default Hero
