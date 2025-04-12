/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import { SVGAvatarBG } from './svg/SVGAvatarBG'

export const Team = () => {
    const PROXIO_TEAM_ITEMS = siteConfig('PROXIO_TEAM_ITEMS', [])
    return (
        <>
            {/* <!-- ====== Team Section Start --> */}
            <section
                id='team'
                className='overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]'>
                <div className='container mx-auto'>
                    <div className='flex -mx-4 '>
                        <div className='flex flex-col'>
                            <div className='mx-auto mb-[60px] max-w-[485px]'>
                                <span className='mb-2 block text-lg font-semibold text-primary'>
                                    {siteConfig('PROXIO_ABOUT_TITLE')}
                                </span>
                                <h2 className='mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]'>
                                    {siteConfig('PROXIO_ABOUT_TEXT_1')}
                                </h2>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: siteConfig('PROXIO_ABOUT_TEXT_2')
                                    }}
                                    className='text-base text-body-color dark:text-dark-6'></p>
                            </div>
                        </div>
                        <div>
                            
                        </div>
                    </div>


                </div>
            </section>
            {/* <!-- ====== Team Section End --> */}
        </>
    )
}
