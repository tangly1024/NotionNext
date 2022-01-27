import LayoutBase from '../Hexo/LayoutBase'

export const LayoutPage = (props) => {
  const { page } = props
  return <LayoutBase {...props}>
    Page - {page}
  </LayoutBase>
}
