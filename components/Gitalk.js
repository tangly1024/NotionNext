import 'gitalk/dist/gitalk.css'
import BLOG from '@/blog.config'
import GitalkComponent from 'gitalk/dist/gitalk-component'

const Gitalk = ({ frontMatter }) => {
  return <GitalkComponent options={{
    id: frontMatter.id,
    title: frontMatter.title,
    clientID: BLOG.COMMENT_GITALK_CLIENT_ID,
    clientSecret: BLOG.COMMENT_GITALK_CLIENT_SECRET,
    repo: BLOG.COMMENT_GITALK_REPO,
    owner: BLOG.COMMENT_GITALK_OWNER,
    admin: BLOG.COMMENT_GITALK_ADMIN.split(','),
    distractionFreeMode: JSON.parse(BLOG.COMMENT_GITALK_DISTRACTION_FREE_MODE)
  }} />
}

export default Gitalk
