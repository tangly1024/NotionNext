import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000
const CONTRIBUTION_LEVEL_THRESHOLDS = {
  level2: 2,
  level3: 3,
  level4: 6
}

const normalizeDate = value => {
  if (!value) return null
  const date = value instanceof Date ? new Date(value) : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const toTimestampMs = value => {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : 0
  const parsed = Date.parse(String(value))
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeRepositoryId = value => {
  if (!value) return ''
  return String(value).replace(/-/g, '').trim().toLowerCase()
}

const formatDayKey = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startOfWeekSunday = date => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const offset = d.getDay()
  d.setDate(d.getDate() - offset)
  return d
}

const endOfWeekSaturday = date => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const offset = 6 - d.getDay()
  d.setDate(d.getDate() + offset)
  return d
}

const getHeatmapLevel = count => {
  if (!count) return 0
  if (count >= CONTRIBUTION_LEVEL_THRESHOLDS.level4) return 4
  if (count >= CONTRIBUTION_LEVEL_THRESHOLDS.level3) return 3
  if (count >= CONTRIBUTION_LEVEL_THRESHOLDS.level2) return 2
  return 1 // 1 contribution/day
}

const getCreatedDate = post => {
  return (
    normalizeDate(post?.createdTime) ||
    normalizeDate(post?.publishDate) ||
    normalizeDate(post?.date?.start_date)
  )
}

const getUpdatedDate = post => {
  return normalizeDate(post?.lastEditedDate)
}

const formatMonthLabel = (year, month) => {
  return new Date(year, month, 1).toLocaleString('en-US', { month: 'short' })
}

const formatTimelineDate = date => {
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
}

const getOrdinalSuffix = day => {
  const mod100 = day % 100
  if (mod100 >= 11 && mod100 <= 13) return 'th'
  const mod10 = day % 10
  if (mod10 === 1) return 'st'
  if (mod10 === 2) return 'nd'
  if (mod10 === 3) return 'rd'
  return 'th'
}

const formatContributionTooltipText = (date, count) => {
  const month = date.toLocaleString('en-US', { month: 'long' })
  const day = date.getDate()
  const dateLabel = `${month} ${day}${getOrdinalSuffix(day)}`

  if (count === 0) return `No contributions on ${dateLabel}.`
  if (count === 1) return `1 contribution on ${dateLabel}.`
  return `${count} contributions on ${dateLabel}.`
}

const formatActivityDayTitle = date => {
  if (!date) return ''
  const month = date.toLocaleString('en-US', { month: 'long' })
  return `${month} ${date.getDate()},`
}

const parseDayKey = dayKey => {
  if (!dayKey) return null
  const parts = String(dayKey).split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0)
}

const pluralize = (count, singular, plural = `${singular}s`) => {
  return count === 1 ? singular : plural
}

const getLastSlugPart = value => {
  if (!value || typeof value !== 'string') return ''
  try {
    const normalized = decodeURIComponent(value).split('?')[0].split('#')[0]
    return normalized
      .replace(/^\/+|\/+$/g, '')
      .replace(/\.html$/i, '')
      .split('/')
      .pop()
      .toLowerCase()
  } catch (error) {
    return value
      .split('?')[0]
      .split('#')[0]
      .replace(/^\/+|\/+$/g, '')
      .replace(/\.html$/i, '')
      .split('/')
      .pop()
      .toLowerCase()
  }
}

const isReadmeLikePage = page => {
  if (!page) return false
  return getLastSlugPart(page.slug) === 'readme.md'
}

const sanitizeReadmeHtml = html => {
  if (!html || typeof html !== 'string') return ''
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\shref\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, ' href="#"')
}

export default function ProfileHome(props) {
  const { posts = [], readmePage, contributionEvents: persistedContributionEvents = [] } = props
  const heatmapGridRef = useRef(null)
  const tooltipTimerRef = useRef(null)
  const [contribCellSize, setContribCellSize] = useState(11)
  const [heatmapTooltip, setHeatmapTooltip] = useState(null)
  const authorName = siteConfig('AUTHOR') || siteConfig('CLAUDE_BLOG_NAME', '', CONFIG) || 'Author'

  const readmeSource = useMemo(() => {
    if (readmePage) return readmePage
    return posts.find(isReadmeLikePage) || null
  }, [readmePage, posts])

  const readmeHtml = useMemo(
    () => sanitizeReadmeHtml(readmeSource?.readmeHtml || ''),
    [readmeSource?.readmeHtml]
  )
  const readmeExcerpt = readmeSource?.excerpt || ''

  const timelinePosts = useMemo(() => {
    return posts
      .map((post, index) => {
        const createdAt = getCreatedDate(post)
        const updatedAt = getUpdatedDate(post)
        if (!createdAt && !updatedAt) return null

        const postId = post.id || post.href || post.slug || `${post.title || 'untitled'}-${index}`
        const hasUpdateEvent =
          Boolean(updatedAt) && (!createdAt || updatedAt.getTime() !== createdAt.getTime())

        return {
          id: postId,
          title: post.title || 'Untitled',
          href: post.href || '#',
          createdAt,
          updatedAt,
          hasUpdateEvent
        }
      })
      .filter(Boolean)
  }, [posts])

  const fallbackContributionEvents = useMemo(() => {
    const events = []

    timelinePosts.forEach(post => {
      if (post.createdAt) {
        events.push({
          type: 'create',
          postId: post.id,
          title: post.title,
          href: post.href,
          date: post.createdAt
        })
      }

      if (post.hasUpdateEvent && post.updatedAt) {
        events.push({
          type: 'update',
          postId: post.id,
          title: post.title,
          href: post.href,
          date: post.updatedAt
        })
      }
    })

    return events
  }, [timelinePosts])

  const contributionEvents = useMemo(() => {
    const persisted = Array.isArray(persistedContributionEvents)
      ? persistedContributionEvents
          .map(event => {
            const postId = normalizeRepositoryId(
              event?.repositoryId || event?.identifier || event?.postId
            )
            const timestampMs = toTimestampMs(
              event?.timestampMs || event?.timestamp || event?.date || event?.time
            )
            const date = timestampMs ? new Date(timestampMs) : null
            if (!postId || !date) return null

            return {
              type: event?.type === 'create' ? 'create' : 'update',
              postId,
              title: event?.title || 'Untitled',
              href: event?.href || '#',
              date
            }
          })
          .filter(Boolean)
      : []

    if (persisted.length) {
      return persisted
    }
    return fallbackContributionEvents
  }, [persistedContributionEvents, fallbackContributionEvents])

  const years = useMemo(() => {
    const yearSet = new Set(contributionEvents.map(event => event.date.getFullYear()))
    yearSet.add(new Date().getFullYear())
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [contributionEvents])

  const [selectedYear, setSelectedYear] = useState(() => years[0] || new Date().getFullYear())
  const [isYearModeActive, setIsYearModeActive] = useState(false)
  const [selectedActivityDayKey, setSelectedActivityDayKey] = useState('')

  useEffect(() => {
    if (!years.includes(selectedYear)) {
      setSelectedYear(years[0] || new Date().getFullYear())
      setIsYearModeActive(false)
    }
  }, [years, selectedYear])

  const yearEvents = useMemo(() => {
    return contributionEvents
      .filter(event => event.date.getFullYear() === selectedYear)
      .sort((a, b) => b.date - a.date)
  }, [contributionEvents, selectedYear])

  const heatmapRange = useMemo(() => {
    if (isYearModeActive) {
      return {
        start: new Date(selectedYear, 0, 1, 0, 0, 0, 0),
        end: new Date(selectedYear, 11, 31, 23, 59, 59, 999)
      }
    }

    const end = new Date()
    const start = new Date(end)
    start.setFullYear(start.getFullYear() - 1)
    start.setDate(start.getDate() + 1)
    start.setHours(0, 0, 0, 0)

    return { start, end }
  }, [isYearModeActive, selectedYear])

  const heatmapEvents = useMemo(() => {
    return contributionEvents.filter(event => {
      return event.date >= heatmapRange.start && event.date <= heatmapRange.end
    })
  }, [contributionEvents, heatmapRange])

  const dayCountMap = useMemo(() => {
    const map = new Map()
    heatmapEvents.forEach(event => {
      const key = formatDayKey(event.date)
      map.set(key, (map.get(key) || 0) + 1)
    })
    return map
  }, [heatmapEvents])

  const heatmapData = useMemo(() => {
    const start = startOfWeekSunday(heatmapRange.start)
    const end = endOfWeekSaturday(heatmapRange.end)
    const rangeStart = new Date(heatmapRange.start)
    rangeStart.setHours(0, 0, 0, 0)
    const rangeEnd = new Date(heatmapRange.end)
    rangeEnd.setHours(0, 0, 0, 0)
    const cells = []

    const cursor = new Date(start)
    while (cursor <= end) {
      const currentDate = new Date(cursor)
      const key = formatDayKey(currentDate)
      const inRange = currentDate >= rangeStart && currentDate <= rangeEnd
      cells.push({
        key,
        date: currentDate,
        count: dayCountMap.get(key) || 0,
        inRange
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    const weekCount = Math.ceil(cells.length / 7)
    const monthMarkers = []
    if (isYearModeActive) {
      let lastWeekIndex = -1
      for (let month = 0; month < 12; month++) {
        const firstDayOfMonth = new Date(selectedYear, month, 1)
        const monthWeekIndex = Math.floor(
          (startOfWeekSunday(firstDayOfMonth).getTime() - start.getTime()) / MS_PER_WEEK
        )
        if (monthWeekIndex < 0 || monthWeekIndex >= weekCount) continue
        if (monthWeekIndex === lastWeekIndex) continue

        monthMarkers.push({
          key: `${selectedYear}-${month}`,
          weekIndex: monthWeekIndex,
          label: formatMonthLabel(selectedYear, month)
        })
        lastWeekIndex = monthWeekIndex
      }
    } else {
      // GitHub 风格：月份标签从“该列首日(周一)属于该月”的第一列开始
      let lastMonthKey = ''
      for (let weekIndex = 0; weekIndex < weekCount; weekIndex++) {
        const weekStartDate = cells[weekIndex * 7]?.date
        if (!weekStartDate) continue

        const markerYear = weekStartDate.getFullYear()
        const markerMonth = weekStartDate.getMonth()
        const markerKey = `${markerYear}-${markerMonth}`
        if (markerKey === lastMonthKey) continue

        monthMarkers.push({
          key: markerKey,
          weekIndex,
          label: formatMonthLabel(markerYear, markerMonth)
        })
        lastMonthKey = markerKey
      }
    }

    return { cells, weekCount, monthMarkers }
  }, [dayCountMap, heatmapRange, isYearModeActive, selectedYear])

  const contributionTitle = isYearModeActive
    ? `${heatmapEvents.length} contributions in ${selectedYear}`
    : `${heatmapEvents.length} contributions in the last year`
  const activeYear = isYearModeActive ? selectedYear : (years[0] || selectedYear)

  const handleSelectYear = year => {
    setSelectedYear(year)
    setIsYearModeActive(true)
    setSelectedActivityDayKey('')
  }

  const handleSelectYearFromDropdown = (year, event) => {
    handleSelectYear(year)
    const details = event?.currentTarget?.closest('details')
    if (details && details.hasAttribute('open')) {
      details.removeAttribute('open')
    }
  }

  const handleSelectActivityDay = cell => {
    if (isYearModeActive && !cell.inRange) return
    const dayKey = formatDayKey(cell.date)
    setSelectedActivityDayKey(prev => (prev === dayKey ? '' : dayKey))
  }

  const clearHeatmapTooltipTimer = () => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
      tooltipTimerRef.current = null
    }
  }

  const getTooltipAnchorFromCell = target => {
    if (!target || typeof target.getBoundingClientRect !== 'function') return null
    const rect = target.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    }
  }

  const scheduleHeatmapTooltip = (event, cell) => {
    if (isYearModeActive && !cell.inRange) return
    clearHeatmapTooltipTimer()

    const text = formatContributionTooltipText(cell.date, cell.count)
    const anchor = getTooltipAnchorFromCell(event.currentTarget)
    if (!anchor) return

    tooltipTimerRef.current = setTimeout(() => {
      setHeatmapTooltip({ text, x: anchor.x, y: anchor.y })
      tooltipTimerRef.current = null
    }, 180)
  }

  const showHeatmapTooltip = (event, cell) => {
    scheduleHeatmapTooltip(event, cell)
  }

  const moveHeatmapTooltip = (event, cell) => {
    setHeatmapTooltip(prev => {
      if (!prev) {
        scheduleHeatmapTooltip(event, cell)
        return prev
      }
      const anchor = getTooltipAnchorFromCell(event.currentTarget)
      if (!anchor) return prev
      return {
        ...prev,
        x: anchor.x,
        y: anchor.y
      }
    })
  }

  const hideHeatmapTooltip = () => {
    clearHeatmapTooltipTimer()
    setHeatmapTooltip(null)
  }

  useEffect(() => {
    return () => {
      clearHeatmapTooltipTimer()
    }
  }, [])

  const selectedActivityDayDate = useMemo(
    () => parseDayKey(selectedActivityDayKey),
    [selectedActivityDayKey]
  )

  const activitySourceEvents = useMemo(() => {
    if (!selectedActivityDayKey) return yearEvents
    return heatmapEvents.filter(event => formatDayKey(event.date) === selectedActivityDayKey)
  }, [selectedActivityDayKey, yearEvents, heatmapEvents])

  const activityGroups = useMemo(() => {
    const groupMap = new Map()
    const isDailyMode = Boolean(selectedActivityDayKey)

    activitySourceEvents.forEach(event => {
      const eventYear = event.date.getFullYear()
      const eventMonth = event.date.getMonth()
      const eventDay = event.date.getDate()
      const groupKey = isDailyMode
        ? formatDayKey(event.date)
        : `${eventYear}-${String(eventMonth + 1).padStart(2, '0')}`

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          groupKey,
          monthLabel: isDailyMode
            ? formatActivityDayTitle(event.date)
            : event.date.toLocaleString('en-US', { month: 'long' }),
          yearLabel: String(eventYear),
          sortKey: isDailyMode
            ? new Date(eventYear, eventMonth, eventDay).getTime()
            : eventYear * 12 + eventMonth,
          updateEvents: [],
          createEvents: []
        })
      }

      const group = groupMap.get(groupKey)
      if (event.type === 'update') {
        group.updateEvents.push(event)
      } else {
        group.createEvents.push(event)
      }
    })

    return Array.from(groupMap.values())
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(group => {
        const updateRepoMap = new Map()

        group.updateEvents.forEach(event => {
          const existing = updateRepoMap.get(event.postId)
          if (existing) {
            existing.commitCount += 1
            if (event.date > existing.updatedAt) {
              existing.updatedAt = event.date
            }
            return
          }

          updateRepoMap.set(event.postId, {
            id: event.postId,
            title: event.title,
            href: event.href,
            commitCount: 1,
            updatedAt: event.date
          })
        })

        const updateRepositories = Array.from(updateRepoMap.values()).sort((a, b) => {
          if (b.commitCount !== a.commitCount) return b.commitCount - a.commitCount
          if (b.updatedAt.getTime() !== a.updatedAt.getTime()) {
            return b.updatedAt - a.updatedAt
          }
          return a.title.localeCompare(b.title)
        })

        const createdRepositories = group.createEvents
          .map(event => ({
            id: event.postId,
            title: event.title,
            href: event.href,
            createdAt: event.date
          }))
          .sort((a, b) => {
            if (b.createdAt.getTime() !== a.createdAt.getTime()) {
              return b.createdAt - a.createdAt
            }
            return a.title.localeCompare(b.title)
          })

        return {
          groupKey: group.groupKey,
          monthLabel: group.monthLabel,
          yearLabel: group.yearLabel,
          commitSummary: updateRepositories.length
            ? {
                commitCount: group.updateEvents.length,
                repositoryCount: updateRepositories.length,
                repositories: updateRepositories
              }
            : null,
          createSummary: createdRepositories.length
            ? {
                repositoryCount: createdRepositories.length,
                repositories: createdRepositories
              }
            : null
        }
      })
      .filter(group => group.commitSummary || group.createSummary)
  }, [activitySourceEvents, selectedActivityDayKey])

  useEffect(() => {
    const gridEl = heatmapGridRef.current
    if (!gridEl || heatmapData.weekCount <= 0) return undefined

    const computeCellSize = () => {
      if (window.innerWidth <= 767) {
        setContribCellSize(prev => (prev === 11 ? prev : 11))
        return
      }

      const width = gridEl.clientWidth
      if (!width) return

      const styles = window.getComputedStyle(gridEl)
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0
      const weekCount = Math.max(1, heatmapData.weekCount)
      const size = (width - gap * (weekCount - 1)) / weekCount
      if (size > 0 && Number.isFinite(size)) {
        setContribCellSize(size)
      }
    }

    computeCellSize()

    const observer = new ResizeObserver(computeCellSize)
    observer.observe(gridEl)

    return () => {
      observer.disconnect()
    }
  }, [heatmapData.weekCount])

  return (
    <div className='claude-profile-home'>
      <div className='claude-profile-home-main'>
        <div className='claude-readme-card'>
          <div className='claude-readme-card-meta'>
            README
            <span className='claude-readme-card-meta-ext'>.md</span>
          </div>
          {readmeHtml ? (
            <div
              className='markdown-body'
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
            />
          ) : (
            <p className='claude-readme-card-excerpt'>{readmeExcerpt}</p>
          )}
        </div>

        <div className='claude-profile-home-timeline'>
          <div className='claude-profile-home-timeline-main'>
            <div className='claude-contrib-section'>
              <h2 className='claude-contrib-title'>{contributionTitle}</h2>
              <section
                className='claude-contrib-card'
                style={{
                  '--claude-contrib-week-count': String(heatmapData.weekCount),
                  '--claude-contrib-cell-size': `${contribCellSize}px`
                }}>
                <div className='claude-contrib-scroll'>
                  <div className='claude-contrib-canvas'>
                    <div className='claude-contrib-months'>
                      {heatmapData.monthMarkers.map(marker => (
                        <span
                          key={marker.key}
                          style={{
                            '--claude-marker-week': String(marker.weekIndex)
                          }}>
                          {marker.label}
                        </span>
                      ))}
                    </div>

                    <div className='claude-contrib-grid-wrap'>
                      <div className='claude-contrib-weekday'>
                        {DAY_LABELS.map((label, index) => (
                          <span key={`day-${index}`}>{label}</span>
                        ))}
                      </div>
                      <div ref={heatmapGridRef} className='claude-contrib-grid'>
                        {heatmapData.cells.map(cell => {
                          const isFutureCellInLastYearMode =
                            !isYearModeActive && !cell.inRange && cell.date > heatmapRange.end
                          const isPlaceholder =
                            (isYearModeActive && !cell.inRange) || isFutureCellInLastYearMode
                          return (
                            <div
                              key={cell.key}
                              className={`claude-contrib-cell ${
                                isPlaceholder
                                  ? 'is-placeholder'
                                  : `level-${getHeatmapLevel(cell.count)}`
                              }`}
                              onMouseEnter={event => showHeatmapTooltip(event, cell)}
                              onMouseMove={event => moveHeatmapTooltip(event, cell)}
                              onMouseLeave={hideHeatmapTooltip}
                              onClick={() => handleSelectActivityDay(cell)}
                              aria-hidden={isPlaceholder}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {heatmapTooltip && (
                  <div
                    className='claude-contrib-tooltip'
                    style={{
                      left: `${heatmapTooltip.x}px`,
                      top: `${heatmapTooltip.y}px`
                    }}>
                    {heatmapTooltip.text}
                  </div>
                )}

                <div className='claude-contrib-legend'>
                  <span>Less</span>
                  <div className='claude-contrib-legend-cells'>
                    <i className='claude-contrib-cell level-0' />
                    <i className='claude-contrib-cell level-1' />
                    <i className='claude-contrib-cell level-2' />
                    <i className='claude-contrib-cell level-3' />
                    <i className='claude-contrib-cell level-4' />
                  </div>
                  <span>More</span>
                </div>
              </section>
            </div>

            <div className='claude-activity-section'>
              <div className='claude-activity-header'>
                <h2 className='claude-activity-title'>Contribution activity</h2>
                <details className='claude-activity-year-dropdown'>
                  <summary className='claude-activity-year-summary'>
                    <span className='claude-activity-year-summary-label'>Year:</span>
                    <span className='claude-activity-year-summary-main'>
                      <span className='claude-activity-year-summary-value'>{activeYear}</span>
                      <span
                        className='Button-visual Button-trailingAction claude-activity-year-summary-caret'
                        aria-hidden='true'>
                        <svg
                          aria-hidden='true'
                          height='16'
                          viewBox='0 0 16 16'
                          version='1.1'
                          width='16'
                          data-view-component='true'
                          className='octicon octicon-triangle-down'>
                          <path d='m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z' />
                        </svg>
                      </span>
                    </span>
                  </summary>
                  <ul className='claude-activity-year-menu'>
                    {years.map(year => {
                      const isActive = year === activeYear
                      return (
                        <li key={`activity-year-${year}`}>
                          <button
                            type='button'
                            className='claude-activity-year-option'
                            onClick={event => handleSelectYearFromDropdown(year, event)}>
                            <span className='claude-activity-year-option-check' aria-hidden='true'>
                              {isActive ? (
                                <svg viewBox='0 0 16 16' width='16' height='16'>
                                  <path d='M13.78 3.97a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06L6 10.69l6.72-6.72a.75.75 0 0 1 1.06 0Z' />
                                </svg>
                              ) : (
                                <span />
                              )}
                            </span>
                            <span>{year}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </details>
              </div>
              <section className='claude-activity-card'>

                {activityGroups.length === 0 && (
                  <div>
                    {selectedActivityDayDate && (
                      <div className='claude-activity-group-title'>
                        <span className='claude-activity-group-title-month'>
                          {formatActivityDayTitle(selectedActivityDayDate)}
                        </span>
                        <span className='claude-activity-group-title-year'>
                          {selectedActivityDayDate.getFullYear()}
                        </span>
                      </div>
                    )}
                    <div className='claude-activity-empty-wrap'>
                      <div className='claude-activity-empty'>
                        {`${authorName} had no activity during this period.`}
                      </div>
                    </div>
                  </div>
                )}

                {activityGroups.map(group => (
                  <div key={group.groupKey} className='claude-activity-group'>
                    <div className='claude-activity-group-title'>
                      <span className='claude-activity-group-title-month'>{group.monthLabel}</span>
                      <span className='claude-activity-group-title-year'>{group.yearLabel}</span>
                    </div>
                    <ul className='claude-activity-list'>
                      {group.commitSummary && (
                        <li className='claude-activity-item claude-activity-item-commit'>
                          <span className='claude-activity-item-badge' aria-hidden='true'>
                            <svg
                              aria-hidden='true'
                              height='16'
                              viewBox='0 0 16 16'
                              version='1.1'
                              width='16'
                              className='claude-activity-item-badge-icon'>
                              <path d='M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V1.5h-8a1 1 0 0 0-1 1v6.708A2.493 2.493 0 0 1 4.5 9h2.25a.75.75 0 0 1 0 1.5H4.5a1 1 0 0 0 0 2h4.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 11.5Zm12.23 7.79h-.001l-1.224-1.224v6.184a.75.75 0 0 1-1.5 0V9.066L10.28 10.29a.75.75 0 0 1-1.06-1.061l2.505-2.504a.75.75 0 0 1 1.06 0L15.29 9.23a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018Z' />
                            </svg>
                          </span>
                          <div className='claude-activity-item-body'>
                            <details className='claude-activity-details' open>
                              <summary className='claude-activity-summary-toggle'>
                                <span className='claude-activity-item-summary'>
                                  Made {group.commitSummary.commitCount}{' '}
                                  {pluralize(group.commitSummary.commitCount, 'commit')} in{' '}
                                  {group.commitSummary.repositoryCount}{' '}
                                  {pluralize(
                                    group.commitSummary.repositoryCount,
                                    'repository',
                                    'repositories'
                                  )}
                                </span>
                                <span className='claude-activity-summary-icons'>
                                  <span className='Details-content--open'>
                                    <svg
                                      aria-label='Collapse'
                                      className='claude-activity-summary-icon'
                                      viewBox='0 0 16 16'
                                      width='16'
                                      height='16'
                                      aria-hidden='true'>
                                      <path d='M10.896 2H8.75V.75a.75.75 0 0 0-1.5 0V2H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 2ZM8.75 15.25a.75.75 0 0 1-1.5 0V14H5.104a.25.25 0 0 1-.177-.427l2.896-2.896a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25Zm-6.5-6.5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z' />
                                    </svg>
                                  </span>
                                  <span className='Details-content--closed'>
                                    <svg
                                      aria-label='Expand'
                                      className='claude-activity-summary-icon'
                                      viewBox='0 0 16 16'
                                      width='16'
                                      height='16'
                                      aria-hidden='true'>
                                      <path d='m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z' />
                                    </svg>
                                  </span>
                                </span>
                              </summary>
                              <ul className='claude-activity-sublist'>
                                {group.commitSummary.repositories.map(repo => (
                                  <li
                                    key={`${group.groupKey}-update-${repo.id}`}
                                    className='claude-activity-subitem claude-activity-subitem-commit'>
                                    <div className='claude-activity-subitem-main'>
                                      <SmartLink href={repo.href} className='claude-activity-link'>
                                        {repo.title}
                                      </SmartLink>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </div>
                        </li>
                      )}

                      {group.createSummary && (
                        <li className='claude-activity-item claude-activity-item-create'>
                          <span className='claude-activity-item-badge' aria-hidden='true'>
                            <svg
                              aria-hidden='true'
                              height='16'
                              viewBox='0 0 16 16'
                              version='1.1'
                              width='16'
                              className='claude-activity-item-badge-icon'>
                              <path d='M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z' />
                            </svg>
                          </span>
                          <div className='claude-activity-item-body'>
                            <details className='claude-activity-details' open>
                              <summary className='claude-activity-summary-toggle'>
                                <span className='claude-activity-item-summary'>
                                  Created {group.createSummary.repositoryCount}{' '}
                                  {pluralize(
                                    group.createSummary.repositoryCount,
                                    'repository',
                                    'repositories'
                                  )}
                                </span>
                                <span className='claude-activity-summary-icons'>
                                  <span className='Details-content--open'>
                                    <svg
                                      aria-label='Collapse'
                                      className='claude-activity-summary-icon'
                                      viewBox='0 0 16 16'
                                      width='16'
                                      height='16'
                                      aria-hidden='true'>
                                      <path d='M10.896 2H8.75V.75a.75.75 0 0 0-1.5 0V2H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 2ZM8.75 15.25a.75.75 0 0 1-1.5 0V14H5.104a.25.25 0 0 1-.177-.427l2.896-2.896a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25Zm-6.5-6.5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z' />
                                    </svg>
                                  </span>
                                  <span className='Details-content--closed'>
                                    <svg
                                      aria-label='Expand'
                                      className='claude-activity-summary-icon'
                                      viewBox='0 0 16 16'
                                      width='16'
                                      height='16'
                                      aria-hidden='true'>
                                      <path d='m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z' />
                                    </svg>
                                  </span>
                                </span>
                              </summary>
                              <ul className='claude-activity-sublist'>
                                {group.createSummary.repositories.map(repo => (
                                  <li
                                    key={`${group.groupKey}-create-${repo.id}`}
                                    className='claude-activity-subitem claude-activity-subitem-create'>
                                    <div className='claude-activity-subitem-main'>
                                      <svg
                                        aria-hidden='true'
                                        height='16'
                                        viewBox='0 0 16 16'
                                        version='1.1'
                                        width='16'
                                        className='claude-activity-subitem-icon'>
                                        <path d='M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z' />
                                      </svg>
                                      <SmartLink href={repo.href} className='claude-activity-link'>
                                        {repo.title}
                                      </SmartLink>
                                    </div>
                                    <time className='claude-activity-date'>
                                      {formatTimelineDate(repo.createdAt)}
                                    </time>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </section>
            </div>
          </div>

          <aside id='year-list-container' className='claude-year-switcher'>
            <div className='claude-year-switcher-sticky'>
              <ul className='claude-year-filter-list'>
                {years.map(year => {
                  const isActive = year === activeYear
                  return (
                    <li key={year}>
                      <button
                        id={`year-link-${year}`}
                        type='button'
                        aria-current={isActive ? 'true' : undefined}
                        aria-label={`Contribution activity in ${year}`}
                        className={`claude-year-filter-item ${isActive ? 'active' : ''}`}
                        onClick={() => handleSelectYear(year)}>
                        {year}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
