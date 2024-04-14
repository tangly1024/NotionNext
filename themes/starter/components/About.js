/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 首页的关于模块
 */
export const About = () => {
  return <>
       {/* <!-- ====== About Section Start 798 439 --> */}
       <section className="bg-gray-50 py-12 lg:py-24 xl:py-32">
				<div className="container px-4 md:px-6">
				  <div className="grid items-center gap-6 lg:grid-cols-[1fr_800px] lg:gap-12">
					<div className="space-y-4">
					  <div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{siteConfig('STARTER_ABOUT_1_TITLE_1', null, CONFIG)}</h2>
						<p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
						{siteConfig('STARTER_ABOUT_1_TEXT_1', null, CONFIG)}
						</p>
					  </div>
					  <div className="flex flex-col gap-2 min-[400px]:flex-row">
						<Link
						  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
						  href="/transcriptionTasks"
						>
						  {siteConfig('STARTER_ABOUT_1_BUTTON_1_TEXT', null, CONFIG)}
						</Link>
					  </div>
					</div>
					<div className="grid gap-4 md:gap-8">
					  <div className="mx-auto aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
						<div className="aspect-video">
						<iframe width="798" height="439" src="https://www.youtube.com/embed/kbiJlsHifpM?si=aV-OqRaOLvbfi6bh" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
						</div>
					  </div>
					</div>
				  </div>
				</div>
			  </section>
    {/* <!-- ====== About Section End --> */}
    </>
}
