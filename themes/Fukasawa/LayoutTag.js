import LayoutBase from './LayoutBase'

export const LayoutTag = (props) => {
  return <LayoutBase {...props}>
    Tag - {props.tag}
  </LayoutBase>
}
