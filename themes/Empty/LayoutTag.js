import LayoutBase from './LayoutBase'

export const LayoutTag = (props) => {
  const { tag } = props
  return <LayoutBase>
     Tag - {tag}
   </LayoutBase>
}
