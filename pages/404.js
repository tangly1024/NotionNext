import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

/**
 * 自定义404界面
 * @returns {JSX.Element}
 * @constructor
 */

const Custom404 = (props) => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.Layout404 {...props}/>
}

export default Custom404
