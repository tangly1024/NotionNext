const Card = ({ children, headerSlot, className }) => {
  return <div className={`${className || ''} card border dark:border-gray-700 rounded-3xl lg:p-6 p-4`}>
    <>{headerSlot}</>
    <section>
        {children}
    </section>
  </div>
}
export default Card
