import BLOG from '@/blog.config'
import React, { Component } from 'react'
import { FacebookProvider, CustomChat } from 'react-facebook'

export default class Messenger extends Component {
  render() {
    return (
      <FacebookProvider appId={BLOG.FACEBOOK_APP_ID} chatSupport>
        <CustomChat pageId={BLOG.FACEBOOK_PAGE_ID} minimized={false} />
      </FacebookProvider>
    )
  }
}
