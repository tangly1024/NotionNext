
/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function CategoryBar(props) {
  const { categoryOptions } = props
  console.log(categoryOptions)
  return <div id='category-bar' className="h-14 mb-2 w-full bg-white border flex py-2 px-4 justify-center items-center rounded-xl">
    {categoryOptions?.map(c => {
      return (
            <div key={c.id}>
                {c.name}
            </div>
      )
    })}
  </div>
}
