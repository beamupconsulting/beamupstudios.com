import { COMPANY_DISPLAY_NAME, NAV_CTA_LABEL, NAV_CTA_URL } from '../../constants'
import { ArrowUpRight } from '../icons'
import './Header.css'

type HeaderProps = {
  onLogoClick: (e: React.MouseEvent) => void
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="header">
      <a href="/" className="logo" onClick={onLogoClick}>
        {COMPANY_DISPLAY_NAME}
      </a>
      <nav className="nav">
        <a href={NAV_CTA_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">
          {NAV_CTA_LABEL}
          <ArrowUpRight />
        </a>
      </nav>
    </header>
  )
}
