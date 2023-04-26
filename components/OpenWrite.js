import { useEffect } from 'react'
/**
 * OpenWrite组件
 * @param {*} post
 */
export const OpenWrite = ({ post }) => {
  const blogId = post.slug
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (blogId && typeof BTWPlugin !== 'undefined') {
      // eslint-disable-next-line no-undef
    //   const btw = new BTWPlugin()
    //   if (typeof btw !== 'undefined') {
    //     btw.init({
    //       id: 'container',
    //       blogId: blogId,
    //       name: 'tangly1024',
    //       qrcode: 'https://open.weixin.qq.com/qr/code?username=gh_29d5e8d7d648',
    //       keyword: '验证码'
    //     })
    //   }
    }
  }, [blogId])
}
