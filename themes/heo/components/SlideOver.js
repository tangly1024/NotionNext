
import { Fragment, useImperativeHandle, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import DarkModeButton from '@/components/DarkModeButton'
import Link from 'next/link'
import TagGroups from './TagGroups'
import { MenuListSide } from './MenuListSide'

/**
 * 侧边抽屉
 * 移动端的菜单在这里
 */
export default function SlideOver(props) {
  const { cRef, tagOptions } = props
  const [open, setOpen] = useState(false)

  /**
                    * 函数组件暴露方法useImperativeHandle
                    */
  useImperativeHandle(cRef, () => ({
    toggleSlideOvers: toggleSlideOvers
  }))

  const toggleSlideOvers = () => {
    setOpen(!open)
  }

  return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 glassmorphism bg-black bg-opacity-30 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-96 max-w-md">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <i className="fa-solid fa-xmark px-2"></i>
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* 内容 */}
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-[#18171d] py-6 shadow-xl">
                                        <div className="relative mt-6 flex-1 flex-col space-y-3 px-4 sm:px-6 dark:text-white ">

                                            <section className='space-y-2 flex flex-col'>
                                                <div>功能</div>
                                                {/* 切换深色模式 */}
                                                <DarkModeBlockButton />
                                            </section>

                                            <section className='space-y-2 flex flex-col'>
                                                <div>博客</div>
                                                {/* 导航按钮 */}
                                                <div className='gap-2 grid grid-cols-2'>
                                                    <Button title={'主页'} url={'/'} />
                                                    <Button title={'关于'} url={'/about'} />
                                                </div>
                                                {/* 用户自定义菜单 */}
                                                <MenuListSide {...props}/>
                                            </section>

                                            <section className='space-y-2 flex flex-col'>
                                                <div>标签</div>
                                                <TagGroups tags={tagOptions} />
                                            </section>

                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
  )
}

/**
 * 一个包含图标的按钮
 */
function DarkModeBlockButton() {
  const darkModeRef = useRef()
  function handleChangeDarkMode() {
    darkModeRef?.current?.handleChangeDarkMode()
  }
  return <button onClick={handleChangeDarkMode} className={'group duration-200 hover:text-white hover:shadow-md hover:bg-blue-600 flex justify-between items-center px-2 py-2 border dark:border-gray-600 bg-white dark:bg-[#ff953e]  rounded-lg'}>
        <DarkModeButton cRef={darkModeRef} className='group-hover:text-white' /> 显示模式
    </button>
}

/**
 * 一个简单的按钮
 */
function Button({ title, url }) {
  return <Link href={url} className={'duration-200 hover:text-white hover:shadow-md flex cursor-pointer justify-between items-center px-2 py-2 border dark:border-gray-600 bg-white hover:bg-blue-600 dark:bg-[#1e1e1e] rounded-lg'}>
        {title}
    </Link>
}
