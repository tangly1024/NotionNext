
export default function LoadingCover() {
  return <div id='cover-loading' className={'z-50 opacity-50  pointer-events-none transition-all duration-300'}>
 <div className='w-full h-screen flex justify-center items-center'>
     <i className="fa-solid fa-spinner text-2xl text-black dark:text-white animate-spin">  </i>
 </div>
</div>
}
