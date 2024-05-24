import React, { useEffect, useState } from 'react'
import Image from 'next/image'

/**
 * Discord Widget
 * @returns
 */
const DiscordWidget = () => {
  const [widgetData, setWidgetData] = useState(null)

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const response = await fetch(
          'https://discord.com/api/guilds/783713892131536927/widget.json'
        )
        const data = await response.json()
        setWidgetData(data)
      } catch (error) {
        console.error('Error fetching Discord widget data:', error)
      }
    }

    fetchWidgetData()
  }, [])

  if (!widgetData) {
    return <></>
  }

  return (
    <div className='shadow-md hover:shadow-xl dark:text-gray-300 border dark:border-black rounded-xl px-2 py-4 bg-white dark:bg-hexo-black-gray lg:duration-100 justify-center'>
      <div className='flex items-center pb-2'>
        <a
          href={widgetData.instant_invite}
          target='_blank'
          rel='noopener noreferrer'
          className='p-1 pr-2 pt-0'>
          <Image
            src='https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F08f4bc37-40c8-4ca9-bf10-b148b765bcb8%2F6e223cc3-4ed0-4e3e-8073-633074f171be%2FCopy_of_Mindset_community_(1).png?id=0996b2d9-cfae-4620-8539-bb8a483d1604&table=collection&spaceId=08f4bc37-40c8-4ca9-bf10-b148b765bcb8&width=60&userId=516f50a6-3fe8-4061-b329-940fc9da147f&cache=v2'
            alt='Discord'
            width={28}
            height={28}
            style={{ borderRadius: '50%' }}
          />
        </a>
        <a
          href={widgetData.instant_invite}
          rel='noopener noreferrer'
          target='_blank'>
          {widgetData.name}
        </a>
      </div>
      <div style={{ width: '100%', height: '450px', overflow: 'hidden' }}>
        <iframe
          src='https://discord.com/widget?id=783713892131536927&theme=light'
          width='100%'
          height='100%'
          allowTransparency='true'
          style={{ border: 'none' }}
          sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'></iframe>
      </div>
    </div>
  )
}

export default DiscordWidget
