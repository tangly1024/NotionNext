import { siteConfig } from '@/lib/config'
import LazyImage from './LazyImage'

/**
 * 公安备案号组件
 * @returns
 */
export const BeiAnGongAn = props => {
  const BEI_AN_GONGAN = siteConfig('BEI_AN_GONGAN')
  // 从BEI_AN_GONGAN 字段中利用正则匹配提取出纯数字部分
  const codeMatch = BEI_AN_GONGAN?.match(/\d+/) // 匹配纯数字
  const code = codeMatch ? codeMatch[0] : null // 如果匹配成功则取出数字部分

  const href = `https://beian.mps.gov.cn/#/query/webSearch?code=${code}` // 动态生成链接

  if (!BEI_AN_GONGAN) {
    return null
  }
  return (
    <div className={`${props.className}`}>
      <LazyImage src='/images/gongan.png' width={15} height={15} />
      <a href={href} target='_blank' rel='noopener noreferrer' className='ml-1'>
        {BEI_AN_GONGAN}
      </a>
    </div>
  )
}
