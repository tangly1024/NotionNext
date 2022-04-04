import BLOG from '@/blog.config'
import { useEffect } from 'react'
import MessengerCustomerChat from 'react-messenger-customer-chat'
const Messenger = () => (
  <MessengerCustomerChat
    pageId={BLOG.FACEBOOK_PAGE_ID}
    appId={BLOG.FACEBOOK_APP_ID}
  />
)
export default Messenger
/**
 *
 */
// export function init() {
//   var chatbox = document.getElementById('fb-customer-chat')
//   chatbox.setAttribute('page_id', BLOG.FACEBOOK_PAGE_ID) // TODO: move to args
//   chatbox.setAttribute('attribution', 'biz_inbox')

//   window.fbAsyncInit = function () {
//     FB.init({
//       xfbml: true,
//       version: 'v11.0'
//     })
//   }
//   ;(function (d, s, id) {
//     var js,
//       fjs = d.getElementsByTagName(s)[0]
//     if (d.getElementById(id)) return
//     js = d.createElement(s)
//     js.id = id
//     js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
//     fjs.parentNode.insertBefore(js, fjs)
//   })(document, 'script', 'facebook-jssdk')
// }

// /**
//  *
//  */
// export function cleanup() {
//   ;(function (d, id) {
//     var target = d.getElementById(id)
//     if (target) {
//       target.parentNode.removeChild(target)
//     }
//   })(document, 'facebook-jssdk')

//   delete window.FB
// }

// export default function Messenger() {
//   useEffect(() => {
//     console.log('Facebook1')
//     init()

//     return () => {
//       cleanup()
//     }
//   }, [])

//   return (
//     <div>
//       <div id="fb-root"></div>

//       <div id="fb-customer-chat" className="fb-customerchat"></div>
//     </div>
//   )
// }
