const Card = ({ children, headerSlot, className }) => {
  return <div data-aos="fade-in" data-aos-duration="1000" className={className}>
        <>{headerSlot}</>
        <section className="shadow mb-4 p-2 bg-white dark:bg-hexo-black-gray hover:shadow-lg duration-200">
            {children}
        </section>
    </div>
}
export default Card
