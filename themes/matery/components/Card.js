const Card = ({ children, headerSlot, className }) => {
  return <div className={className}>
    <>{headerSlot}</>
    <section className="drop-shadow-xl dark:text-gray-300 border dark:border-black rounded-xl px-2 py-4 bg-white dark:bg-hexo-black-gray lg:duration-100">
        {children}
    </section>
  </div>
}
export default Card
