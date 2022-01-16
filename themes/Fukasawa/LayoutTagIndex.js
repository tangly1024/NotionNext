import LayoutBase from './LayoutBase'

export const LayoutTagIndex = (props) => {
  return <LayoutBase {...props}>
    Tag - {props.tag}
  </LayoutBase>
}
