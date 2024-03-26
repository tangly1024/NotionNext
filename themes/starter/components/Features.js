
/**
 * 产品特性相关，将显示在首页中
 * @returns
 */
export const Features = () => {
  return <>
     {/* <!-- ====== Features Section Start --> */}
     <section className="py-12 lg:py-24 xl:py-32">
				<div className="container px-4 md:px-6">
				  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
					<div className="space-y-4">
					  <div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Video Subtitle Generation</h2>
						<p className="text-gray-500 dark:text-gray-400">
						  Automatically generate subtitles for your video content.
						</p>
					  </div>
					  <div className="mx-auto aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
						<div className="aspect-video" >
							<video controls  src="https://hlmgngqkvphwswijomgv.supabase.co/storage/v1/object/sign/aragorn/tmp/aragorntranscription.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmFnb3JuL3RtcC9hcmFnb3JudHJhbnNjcmlwdGlvbi5tcDQiLCJpYXQiOjE3MTAwNTk5MDcsImV4cCI6MjM0MDc3OTkwN30.7V63xM7YYLjdthBgqWR2dk2pb5yUvGA2X7H7R95VM4A&t=2024-03-10T08%3A38%3A27.850Z"></video>
						</div>
					  </div>
					</div>
					<div className="space-y-4">
					  <div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Subtitle Translation</h2>
						<p className="text-gray-500 dark:text-gray-400">Translate your subtitles into multiple languages.</p>
					  </div>
					  <div className="mx-auto aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
						<div className="aspect-video" >
							<video controls  src="https://hlmgngqkvphwswijomgv.supabase.co/storage/v1/object/sign/aragorn/tmp/aragorntranslatemute.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmFnb3JuL3RtcC9hcmFnb3JudHJhbnNsYXRlbXV0ZS5tcDQiLCJpYXQiOjE3MTAwNjIwMzcsImV4cCI6MjM0MDc4MjAzN30.GEL8OQRAsusdNHeOes_jaFJZg6UnFa7wg9x42l3ke_c&t=2024-03-10T09%3A13%3A57.300Z"></video>
						</div>
					  </div>
					</div>
				  </div>
				</div>
			  </section>
			  <section className="bg-gray-50 py-12 lg:py-24 xl:py-32">
				<div className="container px-4 md:px-6">
				  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
					<div className="space-y-4">
					  <div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Hardcoded Subtitle Video Export</h2>
						<p className="text-gray-500 dark:text-gray-400">Export your video with hardcoded subtitles.</p>
					  </div>
					  <div className="mx-auto aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
						<div className="aspect-video" >
							<video controls  src="https://hlmgngqkvphwswijomgv.supabase.co/storage/v1/object/sign/aragorn/tmp/exportbilmute.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmFnb3JuL3RtcC9leHBvcnRiaWxtdXRlLm1wNCIsImlhdCI6MTcxMDA2NTE0MCwiZXhwIjoyMzQwNzg1MTQwfQ.BKCaSEl9kRhh_qYnCwWA-gYMURTAvR78_ehd-ACWKy0&t=2024-03-10T10%3A05%3A40.894Z" />
						</div>
					  </div>
					</div>
					<div className="space-y-4">
					  <div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Subtitle editing</h2>
						<p className="text-gray-500 dark:text-gray-400">Edit, merge, and split your multilingual subtitles.</p>
					  </div>
					  <div className="mx-auto aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
						<div className="aspect-video" >
							<video controls  src="https://hlmgngqkvphwswijomgv.supabase.co/storage/v1/object/sign/aragorn/tmp/edit.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcmFnb3JuL3RtcC9lZGl0Lm1wNCIsImlhdCI6MTcxMDA2Njg5MCwiZXhwIjoyMzQwNzg2ODkwfQ.6Cznj6uI_fMgRL4_QWtLCjuSkce5eOQotaekC71eQZc&t=2024-03-10T10%3A34%3A50.998Z"/>
						</div>
					  </div>
					</div>
					
				  </div>
				</div>
			  </section>
    {/* <!-- ====== Features Section End --> */}
    </>
}
