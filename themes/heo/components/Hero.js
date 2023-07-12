// import Image from 'next/image'

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  return (
        <>

            <notice className="max-w-[88rem] w-full mx-auto flex h-16  px-5">
                <div className="bg-indigo-100 w-full h-full"></div>
            </notice>

            <hero id="hero" style={{ zIndex: 1 }} className="max-w-[88rem] w-full mx-auto flex relative  px-5" >
                <div id='hero-left' className='flex flex-col flex-1 bg-red-200'>
                    <div className="h-60 bg-blue-200 my-2"></div>
                    <div className="h-20  bg-yellow-100 my-2"></div>
                </div>
                <div id='hero-right' className='flex flex-col flex-1 bg-green-200 '>
                    <div className="my-2 h-full bg-indigo-200"></div>

                </div>
            </hero>

        </>
  )
}

export default Hero
