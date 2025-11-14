import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

const LabPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <DynamicLayout theme={theme} layoutName='LayoutPage' {...props}>
      <div className='text-center py-10'>
        <h1 className='text-3xl font-bold'>XR² Lab</h1>
        <p className='mt-4 text-gray-600 dark:text-gray-300'>
          Welcome to Dr. Yang's Extended Reality and Robotics Lab.
        </p>
      </div>
    </DynamicLayout>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'lab', locale })
  return {
    props,
    revalidate: siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}

export default LabPage