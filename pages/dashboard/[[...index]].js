import dynamic from 'next/dynamic'
import DashboardBody from '@/components/ui/dashboard/DashboardBody'
import DashboardHeader from '@/components/ui/dashboard/DashboardHeader'

const SignedIn = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.SignedIn),
  { ssr: false }
)
const SignedOut = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.SignedOut),
  { ssr: false }
)
const RedirectToSignIn = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.RedirectToSignIn),
  { ssr: false }
)

function DashboardFallback() {
  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#1f1d24]'>
      <div className='mb-3 text-sm uppercase tracking-[0.24em] text-neutral-500'>
        Dashboard
      </div>
      <h1 className='mb-4 text-3xl font-bold text-neutral-900 dark:text-white'>
        仪表盘
      </h1>
      <p className='text-sm leading-7 text-neutral-600 dark:text-neutral-300'>
        当前环境未配置 Clerk，仪表盘入口暂不可用。
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <main className='min-h-screen bg-[#f7f9fe] px-6 py-12 dark:bg-[#18171d]'>
      <div className='mx-auto max-w-6xl'>
        {enableClerk ? (
          <>
            <SignedIn>
              <DashboardHeader />
              <DashboardBody />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ) : (
          <DashboardFallback />
        )}
      </div>
    </main>
  )
}
