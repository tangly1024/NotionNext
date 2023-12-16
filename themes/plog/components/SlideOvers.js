import { Fragment, useRef, useImperativeHandle, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Footer } from './Footer'
import SocialButton from './SocialButton'
import { siteConfig } from '@/lib/config'

/**
 * 侧拉抽屉
 * @returns
 */
export default function SlideOvers({ children, cRef }) {
  const [open, setOpen] = useState(false)
  const slideOversRef = useRef({})
  /**
  * 函数组件暴露方法
  */
  useImperativeHandle(cRef, () => ({
    toggleSlideOvers: toggleSlideOvers
  }))

  const toggleSlideOvers = () => {
    setOpen(!open)
  }

  return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog ref={slideOversRef} as="div" className="relative" onClose={setOpen}>
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
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="fixed inset-0 z-10 glassmorphism transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden z-10">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-full pb-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="transform transition ease-in-out duration-500"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full"
                            >
                                <Dialog.Panel style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} className="pointer-events-auto relative y-screen max-h-md glassmorphism w-screen p-4 mb-2">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0 transition-y-32"
                                        enterTo="opacity-100 transition-y-0"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100 transition-y-0"
                                        leaveTo="opacity-0 transition-y-32"
                                    >
                                        <div className='max-w-7xl mx-auto space-y-6'>
                                            <h2 className='text-4xl text-gray-200'>关于{siteConfig('AUTHOR')}</h2>
                                            <h2 className='text-2xl text-gray-400'>{siteConfig('BIO')}</h2>
                                            <h2 className='text-4xl text-gray-200'>联系我</h2>
                                            <SocialButton/>
                                            <Footer/>
                                        </div>
                                    </Transition.Child>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
  )
}
