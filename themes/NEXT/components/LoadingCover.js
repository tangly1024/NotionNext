import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function LoadingCover () {
  return (<div id="loading-cover" className={'md:-mt-20 flex-grow dark:text-white text-black animate__animated animate__fadeIn flex flex-col justify-center z-10 w-full h-screen container mx-auto'}>
  <div className="mx-auto">
    <FontAwesomeIcon icon={faSpinner} spin size='2x'/>
  </div>
</div>
  )
}
