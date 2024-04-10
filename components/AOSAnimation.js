import { isBrowser } from '@/lib/utils'
import AOS from 'aos'

/**
 * 加载滚动动画
 * https://michalsnik.github.io/aos/
 */
export default function AOSAnimation() {
  if (isBrowser) {
    AOS.init()
  }
}
