// import Image from 'next/image'

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  return (
        <div className="mt-16">

            <notice className="max-w-7xl w-full mx-auto flex h-20  px-5">
                <div className="bg-indigo-100 w-full h-full"></div>
            </notice>

            <hero id="hero" style={{ zIndex: 1 }} className="max-w-7xl w-full mx-auto flex relative  px-5" >
                <div id='hero-left' className='flex flex-col flex-1 bg-red-200'>
                    <div className="h-60 bg-blue-200"></div>
                    <div className="h-24  bg-yellow-100"></div>
                </div>
                <div id='hero-right' className='flex flex-col flex-1 bg-green-200'>

                </div>
            </hero>

        </div>
  )
}

export default Hero
