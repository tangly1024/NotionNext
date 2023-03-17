import dynamic from 'next/dynamic'

const MusicPlayer = dynamic(
  () => import('@/components/Player'),
  { ssr: false }
)
export default MusicPlayer
