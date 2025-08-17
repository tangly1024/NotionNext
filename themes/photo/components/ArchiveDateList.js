import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'

export default function ArchiveDateList(props) {
  const postsSortByDate = Object.create(props.allNavPages)
  const { locale } = useGlobal()

  postsSortByDate.sort((a, b) => {
    return b?.publishDate - a?.publishDate
  })

  let dates = []
  postsSortByDate.forEach(post => {
    const date = formatDateFmt(post.publishDate, 'yyyy-MM')
    if (!dates[date]) {
      dates.push(date)
    }
  })
  dates = dates.slice(0, 5)
  return (
    <div>
      <div className="text-2xl dark:text-white mb-2">{locale.NAV.ARCHIVE}</div>
      {dates?.map((date, index) => {
        return (
          <div key={index}>
            <SmartLink
              href={`/archive#${date}`}
              className="hover:underline dark:text-green-500"
            >
              {date}
            </SmartLink>
          </div>
        )
      })}
    </div>
  )
}
