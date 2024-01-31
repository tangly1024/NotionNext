import CONFIG from '../config'
import ModalVideo from './ModalVideo'
import { siteConfig } from '@/lib/config'

export default function Hero() {
  return (
        <section className="relative">

            {/* Illustration behind hero content */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
                <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
                            <stop stopColor="#FFF" offset="0%" />
                            <stop stopColor="#EAEAEA" offset="77.402%" />
                            <stop stopColor="#DFDFDF" offset="100%" />
                        </linearGradient>
                    </defs>
                    <g fill="url(#illustration-01)" fillRule="evenodd">
                        <circle cx="1232" cy="128" r="128" />
                        <circle cx="155" cy="443" r="64" />
                    </g>
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Hero content */}
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">

                    {/* Section header */}
                    <div className="text-center pb-12 md:pb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">{siteConfig('LANDING_HERO_TITLE_1', null, CONFIG)}</span>
                        </h1>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">{siteConfig('LANDING_HERO_P_1', null, CONFIG)}</p>
                            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                                <div>
                                    <a target='_blank' className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                                        href={siteConfig('LANDING_HERO_BUTTON_1_LINK', null, CONFIG)} rel="noreferrer">
                                        {siteConfig('LANDING_HERO_BUTTON_1_TEXT', null, CONFIG)}
                                    </a>
                                </div>
                                <div>
                                    <a target='_blank' className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                                        href={siteConfig('LANDING_HERO_BUTTON_2_LINK', null, CONFIG)} rel="noreferrer">
                                        {siteConfig('LANDING_HERO_BUTTON_2_TEXT', null, CONFIG)}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero image */}
                    <ModalVideo
                        thumb={siteConfig('LANDING_HERO_VIDEO_IMAGE', null, CONFIG)}
                        thumbWidth={768}
                        thumbHeight={432}
                        thumbAlt={siteConfig('HERO_HEADER_1', null, CONFIG)}
                        video={siteConfig('HERO_VIDEO_URL', null, CONFIG)}
                        videoWidth={1920}
                        videoHeight={1080} />

                </div>

            </div>
        </section>
  )
}
