import dynamic from 'next/dynamic'

const ClerkSignIn = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.SignIn),
  { ssr: false }
)

function SignInFallback() {
  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#1f1d24]'>
      <div className='mb-3 text-sm uppercase tracking-[0.24em] text-neutral-500'>
        Sign In
      </div>
      <h1 className='mb-4 text-3xl font-bold text-neutral-900 dark:text-white'>
        登录
      </h1>
      <p className='text-sm leading-7 text-neutral-600 dark:text-neutral-300'>
        当前环境未配置 Clerk，登录入口暂不可用。
      </p>
    </div>
  )
}

export default function SignInPage() {
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <main className='min-h-screen bg-[#f7f9fe] px-6 py-20 dark:bg-[#18171d]'>
      <div className='mx-auto max-w-5xl'>
        {enableClerk ? (
          <div className='flex justify-center'>
            <ClerkSignIn
              routing='path'
              path='/sign-in'
              signUpUrl='/sign-up'
              fallbackRedirectUrl='/dashboard'
            />
          </div>
        ) : (
          <SignInFallback />
        )}
      </div>
    </main>
  )
}
