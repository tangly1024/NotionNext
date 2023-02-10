const Card = ({ children, headerSlot, className }) => {
  return <div className={className}
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
        data-aos-anchor-placement="top-bottom"
    >
        <>{headerSlot}</>
        <section className="shadow mb-4 p-2 bg-white dark:bg-hexo-black-gray hover:shadow-lg duration-200">
            {children}
        </section>
    </div>
}
export default Card
