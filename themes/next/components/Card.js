const Card = ({ children, headerSlot, className }) => {
  return <div
    data-aos="fade-down"
    data-aos-duration="600"
    data-aos-easing="ease-in-out"
    data-aos-once="false"
    data-aos-anchor-placement="top-bottom"
    className={className}>
    <>{headerSlot}</>
    <section className="shadow px-2 py-4 bg-white dark:bg-hexo-black-gray hover:shadow-xl duration-200">
        {children}
    </section>
  </div>
}
export default Card
