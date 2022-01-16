import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import LayoutBase from './LayoutBase'

export const LayoutSlug = (props) => {
  return <LayoutBase {...props}>
    首页
  </LayoutBase>
}
