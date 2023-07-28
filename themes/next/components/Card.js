const Card = (props) => {
  const { children, headerSlot } = props
  return <div {...props}>
    <>{headerSlot}</>
    <section className="shadow px-2 py-4 bg-white dark:bg-hexo-black-gray hover:shadow-xl duration-200">
        {children}
    </section>
  </div>
}
export default Card
