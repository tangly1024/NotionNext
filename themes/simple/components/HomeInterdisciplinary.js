import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'

const HIT_ALPHA_THRESHOLD = 8

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

function getDisciplineHref(node, label) {
  return node?.href || `/search/${encodeURIComponent(label)}`
}

function getDisciplineLayerStyle(rect) {
  return {
    left: `${rect.left}%`,
    top: `${rect.top}%`,
    width: `${rect.width}%`,
    height: `${rect.height}%`
  }
}

function loadAlphaMask(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const context = canvas.getContext('2d', { willReadFrequently: true })
      context.drawImage(img, 0, 0)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      resolve({
        width: canvas.width,
        height: canvas.height,
        data: imageData.data
      })
    }
    img.onerror = reject
    img.src = src
  })
}

function DisciplineImageLayer({
  active,
  href,
  label,
  src,
  alt,
  className,
  imageClassName,
  style
}) {
  if (!src) return null

  const image = (
    <LazyImage
      priority={true}
      src={src}
      alt={alt}
      className={`${imageClassName} pointer-events-none transition-transform duration-200 ease-out ${active ? 'scale-[1.035]' : 'scale-100'} group-focus-visible:scale-[1.035]`}
    />
  )

  return (
    <SmartLink
      href={href}
      title={label}
      aria-label={label}
      style={style}
      className={`${className} group pointer-events-none transition-[filter] duration-200 ease-out ${active ? 'z-30 brightness-105' : ''} focus-visible:z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30`}>
      {image}
      <span className='sr-only'>{label}</span>
    </SmartLink>
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
  const router = useRouter()
  const { locale } = useGlobal()
  const { customMenu, customNav } = props
  const disciplineMapRef = useRef(null)
  const disciplineMasksRef = useRef({})
  const [activeDisciplineId, setActiveDisciplineId] = useState(null)
  const defaultIntroHtml = `
    <p>你好，我叫成亮。是一名泛设计学科的学生</p>
    <p>本科期间，我因为“社区营造”的课题初步接触了以用户为中心的设计（UCD），因缘我开始广泛学习服务设计，用户体验设计（UX）等学科</p>
    <p>我在不同的设计对象和语境里关注用户需求、系统思维，并正在硕士研究生阶段延续这一方向上的探索</p>
  `
  const defaultCreditHtml =
    '重绘自©️envis precisely，这是我已经尝试过的学科，他们间的交叉是设计学的魅力所在'

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
  const introBody =
    siteConfig('SIMPLE_HOME_INTRO_HTML', null, CONFIG) || defaultIntroHtml
  const creditHtml =
    siteConfig('SIMPLE_HOME_CREDIT_HTML', null, CONFIG) || defaultCreditHtml
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
  const creditLogoImage = siteConfig(
    'SIMPLE_HOME_CREDIT_LOGO_IMAGE',
    null,
    CONFIG
  )
  const mapFontSize = Number(siteConfig('SIMPLE_HOME_MAP_FONT_SIZE', null, CONFIG)) || 18
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

  const disciplineLayers = useMemo(
    () =>
      [
        {
          id: 'service',
          label: 'Service Design',
          node: visualNodes.service,
          src: layerServiceImage,
          alt: 'discipline-service-layer',
          rect: { left: -14.26, top: -12.28, width: 112.59, height: 126.42 }
        },
        {
          id: 'ux',
          label: 'UX',
          node: visualNodes.ux,
          src: layerUxImage,
          alt: 'discipline-ux-layer',
          rect: { left: 17.55, top: 19.36, width: 58.25, height: 69.38 }
        },
        {
          id: 'ixd',
          label: 'IxD',
          node: visualNodes.ixd,
          src: layerIxdImage,
          alt: 'discipline-ixd-layer',
          rect: { left: 29.42, top: 30.9, width: 43.44, height: 51.58 }
        },
        {
          id: 'architecture',
          label: 'Architecture',
          node: visualNodes.architecture,
          src: layerArchitectureImage,
          alt: 'discipline-architecture-layer',
          rect: { left: 32.81, top: 0, width: 25.55, height: 58.66 }
        },
        {
          id: 'visual-design',
          label: 'Visual Design',
          node: visualNodes.visualDesign,
          src: layerVisualImage,
          alt: 'discipline-visual-layer',
          rect: { left: 2.75, top: 24.27, width: 45.82, height: 44.3 }
        },
        {
          id: 'hci',
          label: 'HCI',
          node: visualNodes.hci,
          src: layerHciImage,
          alt: 'discipline-hci-layer',
          rect: { left: 54.92, top: 29.74, width: 45.14, height: 34.59 }
        }
      ].map(layer => ({
        ...layer,
        href: getDisciplineHref(layer.node, layer.label)
      })),
    [
      layerArchitectureImage,
      layerHciImage,
      layerIxdImage,
      layerServiceImage,
      layerUxImage,
      layerVisualImage,
      visualNodes.architecture,
      visualNodes.hci,
      visualNodes.ixd,
      visualNodes.service,
      visualNodes.ux,
      visualNodes.visualDesign
    ]
  )
  const hitTestLayers = useMemo(
    () => disciplineLayers.filter(layer => layer.src).slice().reverse(),
    [disciplineLayers]
  )
  const disciplineMaskLayers = useMemo(
    () =>
      [
        { id: 'service', src: layerServiceImage },
        { id: 'ux', src: layerUxImage },
        { id: 'ixd', src: layerIxdImage },
        { id: 'architecture', src: layerArchitectureImage },
        { id: 'visual-design', src: layerVisualImage },
        { id: 'hci', src: layerHciImage }
      ].filter(layer => layer.src),
    [
      layerArchitectureImage,
      layerHciImage,
      layerIxdImage,
      layerServiceImage,
      layerUxImage,
      layerVisualImage
    ]
  )

  const defaultHotspots = [
    { label: 'Service Design', match: 'service', left: -14.26, top: -12.28, width: 112.59, height: 126.42 },
    { label: 'UX', match: 'ux', left: 17.55, top: 19.36, width: 58.25, height: 69.38 },
    { label: 'IxD', match: 'ixd', left: 29.42, top: 30.9, width: 43.44, height: 51.58 },
    { label: 'Architecture', match: 'architecture', left: 32.81, top: 0, width: 25.55, height: 58.66, textLeft: 18.92, textTop: 43.1 },
    { label: 'Visual Design', match: 'visual', left: 2.75, top: 24.27, width: 45.82, height: 44.3, textLeft: 27.46, textTop: 53.96 },
    { label: 'HCI', match: 'hci', left: 54.92, top: 29.74, width: 45.14, height: 34.59, textLeft: 20.25, textTop: 56.01 }
  ]
  const hotspots = parseHotspots(hotspotsConfigRaw).length
    ? parseHotspots(hotspotsConfigRaw)
    : defaultHotspots

  const clickableGroups = [
    {
      label: 'Architecture',
      node: visualNodes.architecture,
      className:
        'left-[32.81%] top-[0%] w-[25.39%] h-[58.66%] rounded-[50%]'
    },
    {
      label: 'Visual Design',
      node: visualNodes.visualDesign,
      className:
        'left-[2.75%] top-[24.27%] w-[45.82%] h-[44.13%] rounded-[50%]'
    },
    {
      label: 'HCI',
      node: visualNodes.hci,
      className:
        'left-[54.92%] top-[29.74%] w-[45.08%] h-[34.46%] rounded-[50%]'
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
  const activeClickableItems = hotspotNodes.length ? hotspotNodes : clickableGroups
  const resolveLabelPosition = item => {
    if (item?.labelLeft !== undefined && item?.labelTop !== undefined) {
      return { left: item.labelLeft, top: item.labelTop }
    }

    if (
      item?.textLeft !== undefined &&
      item?.textTop !== undefined &&
      item?.left !== undefined &&
      item?.top !== undefined &&
      item?.width !== undefined &&
      item?.height !== undefined
    ) {
      return {
        left: item.left + (item.width * item.textLeft) / 100,
        top: item.top + (item.height * item.textTop) / 100
      }
    }

    return null
  }
  const hasLayerMode =
    layerMainImage ||
    layerGroundImage ||
    layerArchitectureImage ||
    layerVisualImage ||
    layerHciImage ||
    layerServiceImage ||
    layerUxImage ||
    layerIxdImage
  const shouldRenderMapLabels = !hasLayerMode && !frameImage && !leftPng
  const shouldRenderClickableOverlays = !hasLayerMode
  const activeDiscipline = disciplineLayers.find(
    layer => layer.id === activeDisciplineId
  )
  const activeDisciplineHref = activeDiscipline?.href

  useEffect(() => {
    if (!hasLayerMode || typeof window === 'undefined') return
    let cancelled = false

    Promise.all(
      disciplineMaskLayers
        .map(layer =>
          loadAlphaMask(layer.src)
            .then(mask => [layer.id, mask])
            .catch(() => [layer.id, null])
        )
    ).then(entries => {
      if (cancelled) return
      disciplineMasksRef.current = entries.reduce((masks, [id, mask]) => {
        masks[id] = mask
        return masks
      }, {})
    })

    return () => {
      cancelled = true
    }
  }, [disciplineMaskLayers, hasLayerMode])

  const findDisciplineAtPoint = useCallback(
    (clientX, clientY) => {
      if (!disciplineMapRef.current) return null
      const mapRect = disciplineMapRef.current.getBoundingClientRect()
      const xPercent = ((clientX - mapRect.left) / mapRect.width) * 100
      const yPercent = ((clientY - mapRect.top) / mapRect.height) * 100

      for (const layer of hitTestLayers) {
        const { left, top, width, height } = layer.rect
        if (
          xPercent < left ||
          xPercent > left + width ||
          yPercent < top ||
          yPercent > top + height
        ) {
          continue
        }

        const hasMask = Object.prototype.hasOwnProperty.call(
          disciplineMasksRef.current,
          layer.id
        )
        if (!hasMask) continue

        const mask = disciplineMasksRef.current[layer.id]
        if (!mask) return layer

        const localX = (xPercent - left) / width
        const localY = (yPercent - top) / height
        const pixelX = Math.min(
          mask.width - 1,
          Math.max(0, Math.floor(localX * mask.width))
        )
        const pixelY = Math.min(
          mask.height - 1,
          Math.max(0, Math.floor(localY * mask.height))
        )
        const alpha = mask.data[(pixelY * mask.width + pixelX) * 4 + 3]
        if (alpha > HIT_ALPHA_THRESHOLD) return layer
      }

      return null
    },
    [hitTestLayers]
  )

  const handleDisciplineMouseMove = useCallback(
    event => {
      if (!hasLayerMode) return
      const layer = findDisciplineAtPoint(event.clientX, event.clientY)
      const nextId = layer?.id || null
      setActiveDisciplineId(current => (current === nextId ? current : nextId))
    },
    [findDisciplineAtPoint, hasLayerMode]
  )

  const handleDisciplineClick = useCallback(
    event => {
      if (!hasLayerMode) return
      const layer = findDisciplineAtPoint(event.clientX, event.clientY)
      if (!layer?.href) return

      event.preventDefault()
      if (/^https?:\/\//.test(layer.href)) {
        window.open(layer.href, '_blank', 'noopener,noreferrer')
        return
      }
      router.push(layer.href)
    },
    [findDisciplineAtPoint, hasLayerMode, router]
  )

  return (
    <section className='relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#FAFAFA] mb-0 overflow-hidden'>
      <div className='mx-auto max-w-[1140px] px-6 xl:px-0 py-8 md:py-5'>
        <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,560px)_minmax(320px,431px)] gap-10 xl:gap-[68px] items-start'>
          <div
            className={`relative w-full max-w-[560px] aspect-[670.8/625] mx-auto xl:mx-0 overflow-visible ${activeDisciplineHref ? 'cursor-pointer' : ''}`}
            onMouseMove={handleDisciplineMouseMove}
            onMouseLeave={() => setActiveDisciplineId(null)}
            onClick={handleDisciplineClick}>
            <div
              ref={disciplineMapRef}
              className='absolute left-[12.48%] top-[9.71%] w-[87.52%] h-[79.1%]'>
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
                  {disciplineLayers.map(layer => (
                    <DisciplineImageLayer
                      key={layer.id}
                      active={activeDisciplineId === layer.id}
                      href={layer.href}
                      label={layer.label}
                      src={layer.src}
                      alt={layer.alt}
                      style={getDisciplineLayerStyle(layer.rect)}
                      className='absolute'
                      imageClassName='absolute inset-0 w-full h-full max-w-none object-cover'
                    />
                  ))}
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

              {shouldRenderClickableOverlays && activeClickableItems.map(
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
                      className={`absolute flex items-center justify-center text-center hover:brightness-95 focus:outline-none focus-visible:outline-none transition-all duration-200 ${item.className || ''}`}
                      style={style}>
                      {resolveLabelPosition(item) || !shouldRenderMapLabels ? null : (
                        <span
                          className='leading-none text-black/85 whitespace-nowrap'
                          style={{ fontSize: `${mapFontSize}px` }}>
                          {item.label}
                        </span>
                      )}
                    </SmartLink>
                  )
                }
              )}

              {shouldRenderMapLabels && activeClickableItems.map((item, index) => {
                const position = resolveLabelPosition(item)
                if (!position) return null

                return (
                  <SmartLink
                    key={`label-${item.node.name}-${item.index ?? index}`}
                    href={item.node.href}
                    className='absolute leading-none text-black/85 whitespace-nowrap hover:brightness-95 transition-all duration-200'
                    style={{
                      left: `${position.left}%`,
                      top: `${position.top}%`,
                      fontSize: `${mapFontSize}px`
                    }}>
                    {item.label}
                  </SmartLink>
                )
              })}

              {!frameImage && !hasLayerMode && !leftPng && (
                <div
                  className='absolute left-[46%] top-[57%] text-black/70'
                  style={{ fontSize: `${Math.max(18, mapFontSize - 2)}px` }}>
                  {centerLabel}
                </div>
              )}
            </div>
          </div>

          <div className='pt-2 xl:pt-[49px] pr-0 space-y-9 text-[16px]'>
            <div
              className='text-black leading-[1.55] space-y-5'
              style={{ fontSize: `${bodyFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: introBody }}
            />
            {creditHtml && (
              <div
                className='text-black leading-[1.4]'
                style={{ fontSize: `${bodyFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: creditHtml }}
              />
            )}
            {creditLogoImage && (
              <LazyImage
                priority={true}
                src={creditLogoImage}
                alt='envis precisely'
                className='w-[173px] h-auto'
              />
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
          <div className='mt-10 md:mt-12 pointer-events-none flex justify-center'>
            <LazyImage
              priority={true}
              src={bottomPng}
              alt='home-bottom-art'
              className='w-[min(92vw,960px)] h-auto'
            />
          </div>
        )}
      </div>
    </section>
  )
}
