const Card = ({ children, headerSlot, className }) => {
  return <div className={className}>
    <>{headerSlot}</>
    <section className="shadow mb-4 p-2 bg-white dark:bg-hexo-black-gray hover:shadow-lg duration-200">
        {children}
    </section>
  </div>
}
export default Card
