import { siteConfig } from '@/lib/config'
import LazyImage from './LazyImage'
import React from 'react'

interface BeiAnGongAnProps {
  className?: string
  /**
   * 自定义图标路径，默认为'/images/gongan.png'
   */
  iconPath?: string
  /**
   * 自定义图标尺寸，默认为15
   */
  iconSize?: number
}

/**
 * 公安备案号组件
 * @param {BeiAnGongAnProps} props - 组件属性
 * @returns {JSX.Element | null} 返回公安备案号组件或null
 */
export const BeiAnGongAn: React.FC<BeiAnGongAnProps> = ({
  className = '',
  iconPath = '/images/gongan.png',
  iconSize = 15
}: BeiAnGongAnProps): JSX.Element | null => {
  const BEI_AN_GONGAN = siteConfig('BEI_AN_GONGAN') as string | null | undefined

  // 更精确的正则匹配，匹配类似"京公网安备11010502030143号"中的数字部分
  const codeMatch = BEI_AN_GONGAN && String(BEI_AN_GONGAN).match(/(\d+)号?$/)
  const code = codeMatch?.[1] ?? null

  // 如果code无效则不渲染
  if (!BEI_AN_GONGAN || !code) {
    return null
  }

  const href = `https://beian.mps.gov.cn/#/query/webSearch?code=${code}`

  return (
    <div className={className}>
      <LazyImage
        src={iconPath}
        width={iconSize}
        height={iconSize}
        alt='公安备案图标'
        className='inline-block align-middle'
        loading='lazy'
        decoding='async'
      />
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer nofollow'
        className='ml-1 hover:underline align-middle'
        aria-label={`公安备案号: ${BEI_AN_GONGAN}`}>
        {BEI_AN_GONGAN}
      </a>
    </div>
  )
}

BeiAnGongAn.displayName = 'BeiAnGongAn'