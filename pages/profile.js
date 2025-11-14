// pages/profile.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isBrowser } from '@/lib/utils'
import { DynamicLayout } from '@/themes/theme'
import { useEffect } from 'react'
import Head from 'next/head'

const ProfilePage = (props) => {
  const { profile } = props // 接收从 getStaticProps 传来的数据

  useEffect(() => {
    if (isBrowser && window.location.hash) {
      setTimeout(() => {
        const el = document.getElementById(window.location.hash.substring(1))
        el?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }, 300)
    }
  }, [])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)

  return (
    <>
      <Head>
        <title>Dr. Wenhao Yang | {BLOG.TITLE}</title>
        <meta name="description" content="Assistant Professor at Lamar University | XR² Lab | Human-Robot Interaction & AR/VR" />
      </Head>

      <DynamicLayout theme={theme} layoutName="LayoutPage" {...props}>
        <main className='max-w-4xl mx-auto px-4 md:px-6 lg:px-8 my-8'>
          <header className='my-6'>
            <h1 className='text-3xl font-bold'>
              Dr. Wenhao Yang
              <span className='ml-2 text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-700'>XR² Lab</span>
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Assistant Professor · Industrial &amp; Systems Engineering (ISE), Lamar University
            </p>
            <nav className='flex flex-wrap gap-3 mt-4 text-sm'>
              <a href="#about" className='hover:underline'>About</a>
              <a href="#research" className='hover:underline'>Research</a>
              <a href="#education" className='hover:underline'>Education</a>
              <a href="#work" className='hover:underline'>Work</a>
              <a href="#service" className='hover:underline'>Service</a>
            </nav>
          </header>

          {/* About */}
          <section id='about' className='my-10'>
            <h2 className='text-2xl font-semibold mb-4'>About Me</h2>
            <div className='prose dark:prose-invert max-w-none'>
              {profile.about.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>

          {/* Research Interests */}
          <section id='research' className='my-10'>
            <h2 className='text-2xl font-semibold mb-4'>Research Interests</h2>
            <div className='flex flex-wrap gap-2'>
              {profile.interests.map((tag, i) => (
                <span key={i} className='text-sm px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'>
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section id='education' className='my-10'>
            <h2 className='text-2xl font-semibold mb-4'>Education</h2>
            <div className='flex flex-col gap-4'>
              {profile.education.map((e, i) => <EduCard key={i} item={e} />)}
            </div>
          </section>

          {/* Work Experience */}
          <section id='work' className='my-10'>
            <h2 className='text-2xl font-semibold mb-4'>Work Experience</h2>
            <div className='flex flex-col gap-4'>
              {profile.experience.map((x, i) => <ExpCard key={i} item={x} />)}
            </div>
          </section>

          {/* Professional Service */}
          <section id='service' className='my-10'>
            <h2 className='text-2xl font-semibold mb-4'>Professional Service</h2>
            <div className='space-y-6'>
              <ServiceBlock title='Reviewer of Journals' items={profile.service.journals} />
              <ServiceBlock title='Reviewer of Peer-reviewed Conferences' items={profile.service.conferences} />
              <ServiceBlock title='Technical Committee' items={profile.service.committees} />
            </div>
          </section>

          <footer className='text-center text-sm text-gray-500 dark:text-gray-400 my-10'>
            © {new Date().getFullYear()} Wenhao Yang · Built on {theme}
          </footer>
        </main>
      </DynamicLayout>
    </>
  )
}

// 组件保持不变
function EduCard({ item }) { /* ... 你的代码 ... */ }
function ExpCard({ item }) { /* ... 你的代码 ... */ }
function ServiceBlock({ title, items }) { /* ... 你的代码 ... */ }

// 关键：把数据传给 props
function getProfileData() {
  return { /* 你原来的全部数据 */ }
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'profile', locale })
  props.profile = getProfileData() // 注入数据
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}

export default ProfilePage
