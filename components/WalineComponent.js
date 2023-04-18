import React from 'react'
import { init } from '@waline/client'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import '@waline/client/dist/waline.css'

const path = ''
let waline = null
/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const WalineComponent = (props) => {
  const containerRef = React.createRef()
  const router = useRouter()

  const updateWaline = url => {
    if (url !== path && waline) {
      waline.update(props)
    }
  }
  const locale = {
    nick: '昵称',
    nickError: '昵称不能少于3个字符',
    mail: '邮箱',
    mailError: '请填写正确的邮件地址',
    link: '网址',
    optional: '可选',
    placeholder: '来叭叭，信息都不留也行哈~\n如果留邮箱的话，被回复时有通知~',
    sofa: '来发评论吧~',
    submit: '提交~',
    like: '喜欢~',
    cancelLike: '取消喜欢',
    reply: '回复~',
    cancelReply: '取消回复',
    comment: '评论~',
    refresh: '刷新',
    more: '加载更多...',
    preview: '预览',
    emoji: '表情',
    uploadImage: '上传图片',
    seconds: '秒前',
    minutes: '分钟前',
    hours: '小时前',
    days: '天前',
    now: '刚刚',
    uploading: '正在上传',
    login: '登录',
    logout: '退出',
    admin: '博主同志',
    sticky: '置个顶',
    word: '字',
    wordHint: '评论字数应在 $0 到 $1 字之间！\n当前字数：$2',
    anonymous: '匿名同志',
    gif: '表情包',
    profile: '个人资料',
    approved: '通过',
    waiting: '待审核',
    spam: '垃圾',
    unsticky: '取消置顶',
    oldest: '按倒序',
    latest: '按正序',
    hottest: '按热度',
    reactionTitle: 'hi,觉得这篇文章咋样？选一个叭~'
  }

  React.useEffect(() => {
    if (!waline) {
      waline = init({
        ...props,
        el: containerRef.current,
        locale,
        serverURL: BLOG.COMMENT_WALINE_SERVER_URL,
        lang: BLOG.lang,
        reaction: true,
        dark: 'html.dark',
        emoji: [
          '//npm.elemecdn.com/@waline/emojis@1.1.0/tieba',
          '//npm.elemecdn.com/@waline/emojis@1.1.0/weibo',
          '//npm.elemecdn.com/@waline/emojis@1.1.0/bilibili'
        ]
      })
    }

    // 跳转评论
    router.events.on('routeChangeComplete', updateWaline)
    const anchor = window.location.hash
    if (anchor) {
      // 选择需要观察变动的节点
      const targetNode = document.getElementsByClassName('wl-cards')[0]

      // 当观察到变动时执行的回调函数
      const mutationCallback = (mutations) => {
        for (const mutation of mutations) {
          const type = mutation.type
          if (type === 'childList') {
            const anchorElement = document.getElementById(anchor.substring(1))
            if (anchorElement && anchorElement.className === 'wl-item') {
              anchorElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
              setTimeout(() => {
                anchorElement.classList.add('animate__animated')
                anchorElement.classList.add('animate__bounceInRight')
                observer.disconnect()
              }, 300)
            }
          }
        }
      }

      // 观察子节点 变化
      const observer = new MutationObserver(mutationCallback)
      observer.observe(targetNode, { childList: true })
    }

    return () => {
      if (waline) {
        waline.destroy()
        waline = null
      }
      router.events.off('routeChangeComplete', updateWaline)
    }
  }, [])

  return <div ref={containerRef} />
}

export default WalineComponent
