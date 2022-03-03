const Card = ({ children, headerSlot, className }) => {
  return <div className={className}>
    <>{headerSlot}</>
    <section className="shadow-md hover:shadow-2xl dark:text-gray-300 border border-gray-100 dark:border-gray-700 rounded-xl px-2 py-4 bg-white dark:bg-gray-800 duration-300">
        {children}
    </section>
  </div>
}
export default Card
