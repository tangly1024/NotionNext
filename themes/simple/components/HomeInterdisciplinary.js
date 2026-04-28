import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

function normalizeMenuNodes(links = []) {
  const nodes = []

  links.forEach(link => {
    if (!link || link.show === false) return

    if (Array.isArray(link.subMenus) && link.subMenus.length > 0) {
      link.subMenus.forEach(sub => {
        if (!sub) return
        nodes.push({
          name: sub.title || sub.name,
          href: sub.href || link.href || '#',
          icon: sub.icon || link.icon
        })
      })
      return
    }

    nodes.push({
      name: link.name,
      href: link.href || '#',
      icon: link.icon
    })
  })

  return nodes.filter(node => node.name).slice(0, 10)
}

function pickSubmenuSource(links = [], preferredParentName = '') {
  if (!Array.isArray(links) || links.length === 0) return links

  if (preferredParentName) {
    const preferred = links.find(
      link =>
        link &&
        link.show !== false &&
        link.name &&
        link.name.includes(preferredParentName) &&
        Array.isArray(link.subMenus) &&
        link.subMenus.length > 0
    )
    if (preferred) return [preferred]
  }

  const firstSubmenuParent = links.find(
    link =>
      link &&
      link.show !== false &&
      Array.isArray(link.subMenus) &&
      link.subMenus.length > 0
  )

  return firstSubmenuParent ? [firstSubmenuParent] : links
}

function parseAliasConfig(rawValue = '') {
  if (!rawValue) return []
  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(item => item?.name && item?.match)
  } catch (error) {
    return []
  }
}

function buildVisualNodes(nodes = [], aliasConfig = []) {
  if (!aliasConfig.length) return nodes

  const aliasNodes = aliasConfig
    .map(alias => {
      const target = nodes.find(
        node =>
          node.name?.toLowerCase().includes(alias.match.toLowerCase()) ||
          node.href?.toLowerCase().includes(alias.match.toLowerCase())
      )
      if (!target) return null
      return {
        name: alias.name,
        href: target.href,
        icon: alias.icon || target.icon
      }
    })
    .filter(Boolean)

  const merged = [...nodes]
  aliasNodes.forEach(aliasNode => {
    if (!merged.some(node => node.name === aliasNode.name)) {
      merged.push(aliasNode)
    }
  })
  return merged.slice(0, 10)
}

function findNodeByKeyword(nodes = [], keyword = '') {
  if (!keyword) return null
  const lower = keyword.toLowerCase()
  return (
    nodes.find(
      node =>
        node?.name?.toLowerCase().includes(lower) ||
        node?.href?.toLowerCase().includes(lower)
    ) || null
  )
}

function parseHotspots(rawValue = '') {
  if (!rawValue) return []
  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      item =>
        item?.label &&
        item?.match &&
        item?.left !== undefined &&
        item?.top !== undefined &&
        item?.width !== undefined &&
        item?.height !== undefined
    )
  } catch (error) {
    return []
  }
}

export default function HomeInterdisciplinary(props) {
  const { locale } = useGlobal()
  const { customMenu, customNav } = props
  const defaultIntroHtml = `
    <p>你好，我叫成亮。是一名泛设计学科的学生。</p>
    <p>本科期间，我因为“社区营造”的课题初步接触了以用户为中心的设计（UCD），因缘我开始广泛学习服务设计，用户体验设计（UX）等学科。</p>
    <p>我在不同的设计对象和语境里关注用户需求、系统思维，并正在硕士研究生阶段延续这一方向上的探索。</p>
    <p>重绘自 © <a href="https://www.instagram.com/envis.precisely/" target="_blank" rel="noreferrer">envis precisely</a>，这是我已经尝试过的学科，他们间的交叉是设计学的魅力所在。</p>
  `

  const fallbackLinks = [
    {
      name: locale?.NAV?.SEARCH || 'Search',
      href: '/search',
      icon: 'fas fa-search',
      show: siteConfig('SIMPLE_MENU_SEARCH', null, CONFIG)
    },
    {
      name: locale?.NAV?.ARCHIVE || 'Archive',
      href: '/archive',
      icon: 'fas fa-archive',
      show: siteConfig('SIMPLE_MENU_ARCHIVE', null, CONFIG)
    },
    {
      name: locale?.COMMON?.CATEGORY || 'Category',
      href: '/category',
      icon: 'fas fa-folder',
      show: siteConfig('SIMPLE_MENU_CATEGORY', null, CONFIG)
    },
    {
      name: locale?.COMMON?.TAGS || 'Tags',
      href: '/tag',
      icon: 'fas fa-tag',
      show: siteConfig('SIMPLE_MENU_TAG', null, CONFIG)
    }
  ]

  let sourceLinks = fallbackLinks
  if (siteConfig('CUSTOM_MENU') && customMenu?.length) {
    sourceLinks = customMenu
  } else if (customNav?.length) {
    sourceLinks = fallbackLinks.concat(customNav)
  }

  const centerLabel = siteConfig(
    'SIMPLE_HOME_INTERDISCIPLINARY_CENTER',
    null,
    CONFIG
  )
  const introTitle =
    siteConfig('SIMPLE_HOME_TITLE_TEXT', null, CONFIG) || siteConfig('AUTHOR')
  const introBody =
    siteConfig('SIMPLE_HOME_INTRO_HTML', null, CONFIG) || defaultIntroHtml
  const signatureText = siteConfig('SIMPLE_HOME_SIGNATURE_TEXT', null, CONFIG)
  const frameImage = siteConfig('SIMPLE_HOME_FRAME_IMAGE', null, CONFIG)
  const layerMainImage = siteConfig('SIMPLE_HOME_LAYER_MAIN_IMAGE', null, CONFIG)
  const layerGroundImage = siteConfig('SIMPLE_HOME_LAYER_GROUND_IMAGE', null, CONFIG)
  const layerArchitectureImage = siteConfig(
    'SIMPLE_HOME_LAYER_ARCHITECTURE_IMAGE',
    null,
    CONFIG
  )
  const layerVisualImage = siteConfig(
    'SIMPLE_HOME_LAYER_VISUAL_IMAGE',
    null,
    CONFIG
  )
  const layerHciImage = siteConfig('SIMPLE_HOME_LAYER_HCI_IMAGE', null, CONFIG)
  const layerServiceImage = siteConfig(
    'SIMPLE_HOME_LAYER_SERVICE_IMAGE',
    null,
    CONFIG
  )
  const layerUxImage = siteConfig('SIMPLE_HOME_LAYER_UX_IMAGE', null, CONFIG)
  const layerIxdImage = siteConfig('SIMPLE_HOME_LAYER_IXD_IMAGE', null, CONFIG)
  const hotspotsConfigRaw = siteConfig('SIMPLE_HOME_HOTSPOTS', null, CONFIG)
  const leftPng = siteConfig('SIMPLE_HOME_LEFT_PNG', null, CONFIG)
  const bottomPng = siteConfig('SIMPLE_HOME_BOTTOM_PNG', null, CONFIG)
  const mapFontSize = Number(siteConfig('SIMPLE_HOME_MAP_FONT_SIZE', null, CONFIG)) || 18
  const titleFontSize = Number(siteConfig('SIMPLE_HOME_TITLE_FONT_SIZE', null, CONFIG)) || 24
  const bodyFontSize = Number(siteConfig('SIMPLE_HOME_BODY_FONT_SIZE', null, CONFIG)) || 24
  const bioFontSize = Number(siteConfig('SIMPLE_HOME_BIO_FONT_SIZE', null, CONFIG)) || 20
  const preferredSubmenuParent = siteConfig(
    'SIMPLE_HOME_SUBMENU_PARENT',
    null,
    CONFIG
  )
  const focusedLinks = pickSubmenuSource(sourceLinks, preferredSubmenuParent)
  const aliasConfigRaw = siteConfig('SIMPLE_HOME_NODE_ALIASES', null, CONFIG)
  const aliasConfig =
    parseAliasConfig(aliasConfigRaw).length > 0
      ? parseAliasConfig(aliasConfigRaw)
      : [{ name: 'Architecture', match: 'Other Works' }]
  const menuNodes = buildVisualNodes(normalizeMenuNodes(focusedLinks), aliasConfig)

  const visualNodes = {
    architecture:
      findNodeByKeyword(menuNodes, 'architecture') || menuNodes[0] || null,
    visualDesign: findNodeByKeyword(menuNodes, 'visual') || menuNodes[1] || null,
    hci: findNodeByKeyword(menuNodes, 'hci') || menuNodes[2] || null,
    ixd:
      findNodeByKeyword(menuNodes, 'ixd') ||
      findNodeByKeyword(menuNodes, 'interaction') ||
      menuNodes[3] ||
      null,
    ux: findNodeByKeyword(menuNodes, 'ux') || menuNodes[4] || null,
    service:
      findNodeByKeyword(menuNodes, 'service') ||
      findNodeByKeyword(menuNodes, 'pssd') ||
      menuNodes[5] ||
      null
  }

  const defaultHotspots = [
    { label: 'Architecture', match: 'architecture', left: 39, top: 6, width: 20, height: 48 },
    { label: 'Visual Design', match: 'visual', left: 10, top: 37, width: 37, height: 25 },
    { label: 'HCI', match: 'hci', left: 58, top: 43, width: 36, height: 23 },
    { label: 'IxD', match: 'ixd', left: 38, top: 37, width: 28, height: 30 },
    { label: 'UX', match: 'ux', left: 41, top: 67, width: 10, height: 8 },
    { label: 'Service Design', match: 'service', left: 14, top: 78, width: 26, height: 8 }
  ]
  const hotspots = parseHotspots(hotspotsConfigRaw).length
    ? parseHotspots(hotspotsConfigRaw)
    : defaultHotspots

  const clickableGroups = [
    {
      label: 'Architecture',
      node: visualNodes.architecture,
      className:
        'left-[39%] top-[6%] w-[20%] h-[48%] rounded-[50%]'
    },
    {
      label: 'Visual Design',
      node: visualNodes.visualDesign,
      className:
        'left-[10%] top-[37%] w-[37%] h-[25%] rounded-[50%]'
    },
    {
      label: 'HCI',
      node: visualNodes.hci,
      className:
        'left-[58%] top-[43%] w-[36%] h-[23%] rounded-[50%]'
    },
    {
      label: 'IxD',
      node: visualNodes.ixd,
      className:
        'left-[38%] top-[37%] w-[28%] h-[30%] rounded-full'
    }
  ].filter(item => item.node)

  const hotspotNodes = hotspots
    .map((spot, index) => {
      const node =
        findNodeByKeyword(menuNodes, spot.match) ||
        findNodeByKeyword(menuNodes, spot.label) ||
        null
      if (!node) return null
      return { ...spot, node, index }
    })
    .filter(Boolean)
  const hasLayerMode =
    layerMainImage ||
    layerGroundImage ||
    layerArchitectureImage ||
    layerVisualImage ||
    layerHciImage ||
    layerServiceImage ||
    layerUxImage ||
    layerIxdImage

  return (
    <section className='relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#FAFAFA] border-t border-[#edf0f3] mb-10'>
      <div className='mx-auto max-w-[1700px] px-0 md:px-0 py-10 md:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-[58%_42%] gap-8 lg:gap-12 items-start'>
          <div className='relative h-[620px] md:h-[760px]'>
            {hasLayerMode ? (
              <>
                {layerMainImage && (
                  <LazyImage
                    src={layerMainImage}
                    alt='discipline-main-layer'
                    className='absolute left-[6%] top-[6%] w-[88%] h-[64%] object-contain'
                  />
                )}
                {layerGroundImage && (
                  <LazyImage
                    src={layerGroundImage}
                    alt='discipline-ground-layer'
                    className='absolute left-[25%] top-[70%] w-[56%] h-[24%] object-contain'
                  />
                )}
                {layerArchitectureImage && (
                  <LazyImage
                    src={layerArchitectureImage}
                    alt='discipline-architecture-layer'
                    className='absolute left-[38%] top-[8%] w-[20%] h-[48%] object-contain'
                  />
                )}
                {layerVisualImage && (
                  <LazyImage
                    src={layerVisualImage}
                    alt='discipline-visual-layer'
                    className='absolute left-[10%] top-[37%] w-[37%] h-[25%] object-contain'
                  />
                )}
                {layerHciImage && (
                  <LazyImage
                    src={layerHciImage}
                    alt='discipline-hci-layer'
                    className='absolute left-[58%] top-[43%] w-[36%] h-[23%] object-contain'
                  />
                )}
                {layerServiceImage && (
                  <LazyImage
                    src={layerServiceImage}
                    alt='discipline-service-layer'
                    className='absolute left-[6%] top-[54%] w-[56%] h-[35%] object-contain'
                  />
                )}
                {layerUxImage && (
                  <LazyImage
                    src={layerUxImage}
                    alt='discipline-ux-layer'
                    className='absolute left-[28%] top-[50%] w-[30%] h-[30%] object-contain'
                  />
                )}
                {layerIxdImage && (
                  <LazyImage
                    src={layerIxdImage}
                    alt='discipline-ixd-layer'
                    className='absolute left-[36%] top-[47%] w-[28%] h-[28%] object-contain'
                  />
                )}
              </>
            ) : frameImage ? (
              <LazyImage
                src={frameImage}
                alt='discipline-frame'
                className='absolute inset-0 w-full h-full object-contain'
              />
            ) : leftPng ? (
              <LazyImage
                src={leftPng}
                alt='discipline-map'
                className='absolute inset-0 w-full h-full object-contain'
              />
            ) : (
              <svg
                className='absolute inset-0 w-full h-full'
                viewBox='0 0 1000 760'
                preserveAspectRatio='xMidYMid meet'>
                <ellipse
                  cx='300'
                  cy='470'
                  rx='310'
                  ry='190'
                  fill='#d9d9d9'
                  fillOpacity='0.38'
                  transform='rotate(-28 300 470)'
                />
                <circle
                  cx='470'
                  cy='430'
                  r='220'
                  fill='#cfd3d9'
                  fillOpacity='0.60'
                />
                <circle
                  cx='510'
                  cy='470'
                  r='145'
                  fill='#e8e0da'
                  fillOpacity='0.92'
                />
                <ellipse
                  cx='470'
                  cy='255'
                  rx='105'
                  ry='205'
                  fill='#d8a88f'
                  fillOpacity='0.88'
                />
                <ellipse
                  cx='275'
                  cy='410'
                  rx='190'
                  ry='118'
                  fill='#ddc8bc'
                  fillOpacity='0.90'
                />
                <ellipse
                  cx='740'
                  cy='430'
                  rx='190'
                  ry='100'
                  fill='#dfa07f'
                  fillOpacity='0.88'
                />
              </svg>
            )}

            {(hotspotNodes.length ? hotspotNodes : clickableGroups).map(
              (item, index) => {
                const style = item.left !== undefined
                  ? {
                      left: `${item.left}%`,
                      top: `${item.top}%`,
                      width: `${item.width}%`,
                      height: `${item.height}%`
                    }
                  : undefined

                return (
                  <SmartLink
                    key={`${item.node.name}-${item.index ?? index}`}
                    href={item.node.href}
                    className={`absolute flex items-center justify-center text-center hover:brightness-95 transition-all duration-200 ${item.className || ''}`}
                    style={style}>
                    <span
                      className='leading-none text-black/85 whitespace-nowrap'
                      style={{ fontSize: `${mapFontSize}px` }}>
                      {item.label}
                    </span>
                  </SmartLink>
                )
              }
            )}

            {!frameImage && !hasLayerMode && (
              <div
                className='absolute left-[46%] top-[57%] text-black/70'
                style={{ fontSize: `${Math.max(18, mapFontSize - 2)}px` }}>
                {centerLabel}
              </div>
            )}
          </div>

          <div className='pt-8 md:pt-20 pr-2 md:pr-10 space-y-8 md:space-y-12'>
            <h1
              className='font-normal text-black leading-tight'
              style={{ fontSize: `${titleFontSize}px` }}>
              {introTitle}
            </h1>
            <div
              className='text-black/90 leading-[1.8] space-y-4'
              style={{ fontSize: `${bodyFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: introBody }}
            />
            {siteConfig('BIO') && (
              <p
                className='text-black/70 leading-[1.7]'
                style={{ fontSize: `${bioFontSize}px` }}>
                {siteConfig('BIO')}
              </p>
            )}
            {signatureText && (
              <div
                className='font-semibold tracking-tight text-black/75'
                style={{ fontSize: `${Math.max(20, bioFontSize + 8)}px` }}>
                {signatureText}
              </div>
            )}
          </div>
        </div>

        {bottomPng && (
          <div className='mt-8 md:mt-14'>
            <LazyImage src={bottomPng} alt='home-bottom-art' className='w-full h-auto' />
          </div>
        )}
      </div>
    </section>
  )
}
