import { isInRange } from '@/lib/utils/time.util'
import type { SiteData } from '../site.types'

export function applySchedulePublish(db: SiteData) {
  db.allPages?.forEach(p => {
    if (!isInRange(p.title, p.date)) {
      p.status = 'Invisible'
    }
  })
}
