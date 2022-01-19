const Card = ({ children, headerSlot, className }) => {
  return <div className={className}>
    <>{headerSlot}</>
    <section className="shadow mb-4 p-2 bg-white dark:bg-gray-800 hover:shadow-lg duration-200">
        {children}
    </section>
  </div>
}
export default Card
