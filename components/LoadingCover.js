import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function LoadingCover () {
  return (<div id="loading-cover" className={'bg-white dark:bg-gray-800 dark:text-white text-black animate__animated animate__fadeIn flex-grow flex flex-col justify-center z-10 w-full h-screen container mx-auto'}>
  <div className="mx-auto">
    <FontAwesomeIcon icon={faSpinner} spin={true} className="text-2xl" />
  </div>
</div>
  )
}
