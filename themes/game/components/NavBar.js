import { MenuList } from './MenuList'

export default function NavBar({ className }) {
  return (
    <nav className={className}>
      <MenuList />
    </nav>
  )
}
