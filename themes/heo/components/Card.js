import React from 'react'

const Card = React.forwardRef(({ children, headerSlot, className }, ref) => {
  return (
    <div ref={ref} className={`${className || ''} card border dark:border-gray-700 rounded-xl lg:p-6 p-4`}>
      <>{headerSlot}</>
      <section>
        {children}
      </section>
    </div>
  )
})

Card.displayName = 'Card'

export default Card
