import { useGlobal } from '@/lib/global'

/**
 * 版权声明
 * @returns
 */
export default function NotByAI() {
  const { lang, isDarkMode } = useGlobal()

  return (
    <img
      className='transform hover:scale-110 duration-150'
      src={`/svg/not-by-ai/${lang}/Written-By-Human-Not-By-AI-Badge-${isDarkMode ? 'black' : 'white'}.svg`}
      alt='not-by-ai'
    />
  )
}
