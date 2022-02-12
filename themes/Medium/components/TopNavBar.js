import LogoBar from '@/themes/Medium/components/LogoBar'

export default function TopNavBar ({ className }) {
  return <div id='top-nav' className={'sticky top-0 w-full z-50 ' + className}>
    <div className='flex w-full h-12 shadow bg-white px-5 items-center'>
      <LogoBar />
    </div>
  </div>
}
