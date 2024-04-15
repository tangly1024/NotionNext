import * as React from 'react'

function SvgCollectionViewGallery(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 14 14' {...props}>
      <path d='M12 1.5H2a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V2a.5.5 0 00-.5-.5zM2 0h10a2 2 0 012 2v10a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm1 3h3.5v3.5H3V3zm4.5 0H11v3.5H7.5V3zM3 7.5h3.5V11H3V7.5zm4.5 0H11V11H7.5V7.5z' />
    </svg>
  )
}

export default SvgCollectionViewGallery
