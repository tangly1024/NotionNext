import LayoutBase from './LayoutBase'

export const Layout404 = props => {
  return <LayoutBase {...props}>
   <div className='w-full h-96 py-80 flex justify-center items-center'>404 Not found.</div>
  </LayoutBase>
}
