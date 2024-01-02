import AOS from 'aos'
import { isBrowser } from 'react-notion-x'

/**
 * 加载滚动动画
 * https://michalsnik.github.io/aos/
 */
export default function AOSAnimation() {
  if (isBrowser) {
    AOS.init()
  }
}
