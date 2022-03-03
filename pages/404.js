import { useGlobal } from '@/lib/global'

/**
 * 自定义404界面
 * @returns {JSX.Element}
 * @constructor
 */

export default function Custom404 (props) {
  const { ThemeComponents } = useGlobal()

  return <ThemeComponents.Layout404 {...props}/>
}
