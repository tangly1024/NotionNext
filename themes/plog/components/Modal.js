import { ArrowPath, ChevronLeft, ChevronRight } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { compressImage } from '@/lib/notion/mapImage'
import { Dialog, Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { Fragment, useRef, useState } from 'react'
import { usePlogGlobal } from '..'

/**
 * 弹出框
 */
export default function Modal(props) {
  const { showModal, setShowModal, modalContent, setModalContent } =
    usePlogGlobal()
  const { siteInfo, posts } = props
  const cancelButtonRef = useRef(null)
  const thumbnail =
    modalContent?.pageCoverThumbnail || siteInfo?.pageCoverThumbnail
  const bigImage = compressImage(
    modalContent?.pageCover || siteInfo?.pageCover,
    1200,
    85,
    'webp'
  )
  const imgRef = useRef(null)

  // 添加loading状态
  const [loading, setLoading] = useState(true)

  // 在图片加载完成时设置loading为false
  function handleImageLoad() {
    setLoading(false)
  }

  // 关闭弹窗
  function handleClose() {
    setShowModal(false)
    setLoading(true)
  }

  // 修改当前显示的遮罩内容
  function prev() {
    setLoading(true)
    const index = posts?.findIndex(post => post.slug === modalContent.slug)
    if (index === 0) {
      setModalContent(posts[posts.length - 1])
    } else {
      setModalContent(posts[index - 1])
    }
  }
  // 下一个
  const next = () => {
    setLoading(true)
    const index = posts.findIndex(post => post.slug === modalContent.slug)
    if (index === posts.length - 1) {
      setModalContent(posts[0])
    } else {
      setModalContent(posts[index + 1])
    }
  }

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-20'
        initialFocus={cancelButtonRef}
        onClose={handleClose}>
        {/* 遮罩 */}
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className='fixed inset-0 glassmorphism transition-opacity'
          />
        </Transition.Child>

        <div className='fixed inset-0 z-30 overflow-y-auto'>
          <div className='flex min-h-full justify-center p-4 text-center items-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 scale-50 w-0'
              enterTo={'opacity-100 translate-y-0 max-w-screen'}
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 scale-100  max-w-screen'
              leaveTo='opacity-0 translate-y-4 scale-50 w-0'>
              <Dialog.Panel className='group relative transform overflow-hidden rounded-xl text-left shadow-xl transition-all '>
                {/* 添加onLoad事件处理函数 */}
                {/* 添加loading状态 */}
                {/* <div
                  className={`bg-hexo-black-gray w-32 h-32 flex justify-center items-center `}> */}
                <div
                  className={`absolute right-0 bottom-0 m-4 ${loading ? '' : 'hidden'}`}>
                  <ArrowPath
                    className={`w-10 h-10 animate-spin text-gray-200`}
                  />
                </div>

                {/* </div> */}

                <SmartLink href={modalContent?.href}>
                  <LazyImage
                    onLoad={handleImageLoad}
                    placeholderSrc={thumbnail}
                    src={bigImage}
                    ref={imgRef}
                    className={`w-full select-none max-w-7xl max-h-[90vh] shadow-xl  animate__animated animate__fadeIn'`}
                  />
                </SmartLink>

                <>
                  <div className='absolute bottom-0 left-0 m-4 z-20'>
                    <div className='flex'>
                      <h2
                        style={{ textShadow: '0.1em 0.1em 0.2em black' }}
                        className='text-2xl md:text-5xl text-white mb-4 px-2 py-1 rounded-lg'>
                        {modalContent?.title}
                      </h2>
                    </div>
                    <div
                      style={{ textShadow: '0.1em 0.1em 0.2em black' }}
                      className={
                        'line-clamp-3 md:line-clamp-none overflow-hidden cursor-pointer text-gray-50 rounded-lg m-2'
                      }>
                      {modalContent?.summary}
                    </div>

                    {modalContent?.category && (
                      <div className='flex'>
                        <SmartLink
                          href={`/category/${modalContent?.category}`}
                          className='text-xs rounded-lg mt-3 px-2 py-1 bg-black bg-opacity-20 text-white hover:bg-blue-700 hover:text-white duration-200'>
                          {modalContent?.category}
                        </SmartLink>
                      </div>
                    )}
                  </div>

                  {/* 卡片的阴影遮罩，为了凸显图片上的文字 */}
                  <div className='h-1/2 w-full absolute left-0 bottom-0'>
                    <div className='h-full w-full absolute opacity-80 group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-b from-transparent to-black'></div>
                  </div>

                  {/* <div className="z-10 absolute hover:opacity-50 opacity-0 duration-200 transition-opacity w-full top-0 left-0 px-4 h-full items-center flex justify-between"> */}

                  <div
                    onClick={prev}
                    className='z-10 absolute left-0 top-1/2 -mt-12 group-hover:opacity-50 opacity-0 duration-200 transition-opacity'>
                    <ChevronLeft className='cursor-pointer w-24 h-32 hover:opacity-100 stroke-white stroke-1 scale-y-150' />
                  </div>
                  <div
                    onClick={next}
                    className='z-10 absolute right-0 top-1/2 -mt-12 group-hover:opacity-50 opacity-0 duration-200 transition-opacity'>
                    <ChevronRight className='cursor-pointer w-24 h-32 hover:opacity-100 stroke-white stroke-1 scale-y-150' />
                  </div>
                  {/* </div> */}
                </>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
