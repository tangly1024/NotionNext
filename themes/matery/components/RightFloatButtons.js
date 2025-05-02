import JumpToTopButton from './JumpToTopButton'
import FloatDarkModeButton from './FloatDarkModeButton'
import SocialButton from './SocialButton'

/**
 * 右下角悬浮按钮
 * @param {*} param0
 * @returns
 */
export default function RightFloatButtons(props) {
  const { floatRightBottom } = props
  return <div className="bottom-40 right-2 fixed justify-end space-y-2 z-20">
        <FloatDarkModeButton />
        <JumpToTopButton />
        <SocialButton />
        {/* 可扩展的右下角悬浮 */}
        {floatRightBottom}
    </div>
}
