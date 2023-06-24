import { useMediumGlobal } from '../LayoutBase'

export default function FloatTocButton () {
  const { tocVisible, changeTocVisible } = useMediumGlobal()

  const toggleToc = () => {
    changeTocVisible(!tocVisible)
  }

  return (
    <div
      onClick={toggleToc}
      className={ 'text-black dark:border-gray-500 flex justify-center items-center dark:text-gray-200 py-2 px-2'
      }
    >
      <a
        id="darkModeButton"
        className={'fa-list-ol cursor-pointer fas hover:scale-150 transform duration-200'}
      />
    </div>
  )
}
