import { SignIn } from '@clerk/nextjs'
import NotionPage from '@/components/NotionPage'

/**
 * 登录页面
 * @param {*} props
 * @returns
 */
export const LayoutSignIn = props => {
  const { post } = props
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <>
      <div className='grow mt-20'>
        {/* clerk预置表单 */}
        {enableClerk && (
          <div className='flex justify-center py-6'>
            <SignIn />
          </div>
        )}
        <div id='article-wrapper'>
          <NotionPage post={post} />
        </div>
      </div>
    </>
  )
}
