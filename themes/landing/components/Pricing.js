import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'

/**
 * 价格收费表
 */
export const Pricing = (props) => {
  return <div className="w-full mx-auto bg-white dark:bg-black px-5 py-10 text-gray-800 mb-10">
    <div className="text-center max-w-xl mx-auto">
        <h1 className="text-5xl md:text-5xl font-bold mb-5 dark:text-white">{siteConfig('LANDING_PRICING_TITLE', null, CONFIG)}</h1>
        <h3 className="text-xl font-medium mb-10 dark:text-gray-400">{siteConfig('LANDING_PRICING_P', null, CONFIG)}</h3>
    </div>
    <div className="max-w-4xl mx-auto md:flex">
        <div className="w-full md:w-1/3 md:max-w-none bg-white dark:bg-hexo-black-gray px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-6 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
            <div className="w-full flex-grow dark:text-gray-400">
                <h2 className="text-center font-bold uppercase mb-4">{siteConfig('LANDING_PRICING_1_TITLE', null, CONFIG)}</h2>
                <h3 className="text-center font-bold text-4xl mb-5">{siteConfig('LANDING_PRICING_1_PRICE', null, CONFIG)}</h3>
                <ul className="text-sm px-5 mb-8">
                    {siteConfig('LANDING_PRICING_1_CONTENT', null, CONFIG)?.split(',').map((item, index) => <li key={index} className="leading-tight"><i className="mdi-check-bold text-lg"></i>{item}</li>
                    )}
                </ul>
            </div>
            <Link className="w-full" href={siteConfig('LANDING_PRICING_1_URL', null, CONFIG)}>
                <button className="font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md px-10 py-2 transition-colors w-full">{siteConfig('LANDING_PRICING_1_BUTTON', null, CONFIG)}</button>
            </Link>
        </div>
        <div className="w-full md:w-1/3 md:max-w-none bg-white dark:bg-hexo-black-gray px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:-mx-3 md:mb-0 rounded-md shadow-lg shadow-gray-600 md:relative md:z-20 md:flex md:flex-col">
            <div className="w-full flex-grow dark:text-gray-400">
                <h2 className="text-center font-bold uppercase mb-4">{siteConfig('LANDING_PRICING_2_TITLE', null, CONFIG)}</h2>
                <h3 className="text-center font-bold text-4xl md:text-5xl mb-5">{siteConfig('LANDING_PRICING_2_PRICE', null, CONFIG)}</h3>
                <ul className="text-sm px-5 mb-8">
                    {siteConfig('LANDING_PRICING_2_CONTENT', null, CONFIG)?.split(',').map((item, index) => <li key={index} className="leading-tight"><i className="mdi-check-bold text-lg"></i>{item}</li>
                    )}
                </ul>
            </div>
            <Link className="w-full" target='_blank' href={siteConfig('LANDING_PRICING_2_URL', null, CONFIG)}>
                <button className="font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md px-10 py-2 transition-colors w-full">{siteConfig('LANDING_PRICING_2_BUTTON', null, CONFIG)}</button>
            </Link>
        </div>
        <div className="w-full md:w-1/3 md:max-w-none bg-white dark:bg-hexo-black-gray px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-6 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
            <div className="w-full flex-grow dark:text-gray-400">
                <h2 className="text-center font-bold uppercase mb-4">{siteConfig('LANDING_PRICING_3_TITLE', null, CONFIG)}</h2>
                <h3 className="text-center font-bold text-4xl mb-5">{siteConfig('LANDING_PRICING_3_PRICE', null, CONFIG)}</h3>
                <ul className="text-sm px-5 mb-8">
                    {siteConfig('LANDING_PRICING_3_CONTENT', null, CONFIG)?.split(',').map((item, index) => <li key={index} className="leading-tight"><i className="mdi-check-bold text-lg"></i>{item}</li>
                    )}
                </ul>
            </div>
            <Link className="w-full" target='_blank' href={siteConfig('LANDING_PRICING_3_URL', null, CONFIG)}>
                <button className="font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md px-10 py-2 transition-colors w-full">{siteConfig('LANDING_PRICING_3_BUTTON', null, CONFIG)}</button>
            </Link>
        </div>
    </div>
</div>
}
