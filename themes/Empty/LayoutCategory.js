import LayoutBase from './LayoutBase'

export const LayoutCategory = (props) => {
  const { category } = props
  return <LayoutBase {...props}>
    Category -  {category}
  </LayoutBase>
}
