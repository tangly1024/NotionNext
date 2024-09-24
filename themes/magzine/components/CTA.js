/**
 * CTA，用于创建一个呼吁用户行动的部分（Call To Action，简称 CTA）。
 * 该组件通过以下方式激励用户进行特定操作
 * 用户的公告栏内容将在此显示
 **/
export default function CTA({ notice }) {
  return (
    <>
      {/* 底部 */}
      <Announcement
        post={notice}
        className={
          'text-center text-black bg-[#7BE986] dark:bg-hexo-black-gray py-16'
        }
      />
    </>
  )
}
