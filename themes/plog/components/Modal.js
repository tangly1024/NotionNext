import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { usePlogGlobal } from '..'
import { ArrowPath } from '@/components/HeroIcons'
import Link from 'next/link'

/**
 * 弹出框
 */
export default function Modal(props) {
  const { showModal, setShowModal, modalContent } = usePlogGlobal()
  const { siteInfo } = props
  const cancelButtonRef = useRef(null)
  const img = modalContent?.pageCover || siteInfo?.pageCover
  const imgRef = useRef(null)

  // 添加loading状态
  const [loading, setLoading] = useState(true)

  // 在图片加载完成时设置loading为false
  async function handleImageLoad() {
    setLoading(false)
  }

  // 关闭弹窗
  function handleClose() {
    setShowModal(false)
    setLoading(true)
  }
  return (
        <Transition.Root show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleClose}>
                {/* 遮罩 */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div style={{ backgroundColor: '#00000063' }} className="fixed inset-0 glassmorphism transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full justify-center p-4 text-center items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 scale-50 w-0"
                            enterTo={'opacity-100 translate-y-0 max-w-screen'}
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 scale-100  max-w-screen"
                            leaveTo="opacity-0 translate-y-4 scale-50 w-0"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-xl text-left shadow-xl transition-all ">
                                {/* 添加loading状态 */}
                                <div className={`bg-hexo-black-gray w-32 h-32 flex justify-center items-center ${loading ? '' : 'hidden'}`}>
                                    <ArrowPath className='w-10 h-10 animate-spin text-gray-200' />
                                </div>
                                {/* 添加onLoad事件处理函数 */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} ref={imgRef} className={'w-full max-w-7xl max-h-[90vh] shadow-xl'} onLoad={handleImageLoad} style={{ display: loading ? 'none' : 'block' }} />
                                    {!loading && <div className='absolute bottom-0 left-0 m-4'>
                                    <div className='flex'>
                                        <h2 style={{ textShadow: '0.1em 0.1em 0.2em black' }} className='text-5xl text-white mb-4 px-2 py-1 rounded-lg'>{modalContent?.title}</h2>
                                    </div>
                                    <div style={{ textShadow: '0.1em 0.1em 0.2em black' }} className={'text-gray-50  rounded-lg p-2'}>{modalContent?.summary}</div>
                                    {modalContent?.category && <div className='flex '>
                                        <Link href={`/category/${modalContent?.category}`} className='text-xs rounded-lg mt-3 px-2 py-1 bg-black bg-opacity-20 text-white hover:bg-blue-700 hover:text-white duration-200'>
                                            {modalContent?.category}
                                        </Link>
                                    </div>}
                                </div>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
  )
}
