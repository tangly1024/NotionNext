import { useGlobal } from '@/lib/global'
import { useEffect } from 'react'

/**
 * 主题文件被加载出之前的占位符
 * @returns
 */
const Loading = (props) => {
  const { theme, setOnReading } = useGlobal()

  useEffect(() => {
    // 返回一个函数，在组件销毁时设置 onReading 为 false
    return () => {
      setTimeout(() => {
        setOnReading(false)
      }, 500)
    }
  }, [theme])

  return <div className="w-screen h-screen flex justify-center items-center bg-black">
       <i className='mr-5 fas fa-spinner animate-spin text-2xl' />
    </div>
}
export default Loading
