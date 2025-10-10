export default function LoadingCover () {
  return (<div id="loading-cover" className={'md:-mt-20 flex-grow dark:text-white text-black animate__animated animate__fadeIn flex flex-col justify-center z-50 w-full h-screen container mx-auto'}>
  <div className="mx-auto">
    <i className="fas fa-spinner animate-spin"/>
  </div>
</div>
  )
}
