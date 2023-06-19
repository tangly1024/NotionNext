import ArticleDetail from './components/ArticleDetail'
import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'

export const LayoutSlug = (props) => {
  const { lock, validPassword } = props
  return (
    <LayoutBase {...props} >
      {!lock && <ArticleDetail {...props} />}
      {lock && <ArticleLock validPassword={validPassword} />}
    </LayoutBase>
  )
}

export default LayoutSlug
