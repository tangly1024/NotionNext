import React, { useEffect } from 'react'
import BLOG from '@/blog.config'

const YandexRTBAdvertisement = () => {
  useEffect(() => {
    if (BLOG.LANG === 'ru-RU') {
      // Function to render Yandex advertisement
      const renderYandexAd = () => {
        if (window.yaContextCb) {
          window.yaContextCb.push(() => {
            window.Ya.Context.AdvManager.render({
              blockId: 'R-A-7739238-1',
              renderTo: 'yandex_rtb_R-A-7739238-1'
            })
          })
        }
      }

      // Call the function to render the Yandex advertisement
      renderYandexAd()

      // Clean up function (optional)
      return () => {
        // Perform any cleanup here if needed
      }
    }
  }, []) // Empty dependency array means this effect runs only once after initial render

  // Conditional rendering based on locale
  return BLOG.LANG === 'ru-RU' ? (
    <div id='yandex_rtb_R-A-7739238-1' className='py-4'>
      {/* This div will be used to render the Yandex advertisement */}
    </div>
  ) : null
}

export default YandexRTBAdvertisement
