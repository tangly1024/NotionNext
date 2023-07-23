import Tags from './Tags'

export default function BlogListBar(props) {
  const { tag, setFilterKey } = props
  const handleSearchChange = (val) => {
    setFilterKey(val)
  }
  if (tag) {
    return (<div className="mb-4">
            <div className='relative'>
                <input
                    type="text"
                    placeholder={
                        tag ? `Search in #${tag}` : 'Search Articles'
                    }
                    className="outline-none block w-full border px-4 py-2 border-black bg-white text-black dark:bg-night dark:border-white dark:text-white"
                    onChange={e => handleSearchChange(e.target.value)}
                />
                <svg
                    className="absolute right-3 top-3 h-5 w-5 text-black dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
            </div>
            <Tags {...props} />
        </div>)
  } else {
    return <></>
  }
}
