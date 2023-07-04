import Catalog from './Catalog'

/**
 * 目录
 * @param {*} param0
 * @returns
 */
export default function CatalogWrapper({ post }) {
  if (post?.toc?.length > 0) {
    return <div id='toc-wrapper' style={{ zIndex: '-1' }} className='absolute top-0 w-full h-full xl:block hidden lg:max-w-3xl 2xl:max-w-4xl' >
            <div data-aos-delay="200"
                data-aos="fade-down"
                data-aos-duration="200"
                data-aos-once="true"
                data-aos-anchor-placement="top-center"
                className='relative h-full'>
                <div className='float-right xl:-mr-72 xl:w-72 w-56 -mr-56 h-full mt-40'>
                    <div className='sticky top-24'>
                        <Catalog toc={post.toc} />
                    </div>
                </div>
            </div>
        </div>
  } else {
    return <></>
  }
}
