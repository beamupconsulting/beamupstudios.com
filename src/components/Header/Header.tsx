import { LEGAL_EMAIL } from '../../constants'
import './Header.css'

type HeaderProps = {
  onLogoClick: (e: React.MouseEvent) => void
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="topbar">
      <a href="/" className="topbar__mark" onClick={onLogoClick}>
        <span>BEAMUP</span>
        <span>Studios</span>
      </a>
      <a className="topbar__mail" href={`mailto:${LEGAL_EMAIL}`}>
        {LEGAL_EMAIL}
      </a>
    </header>
  )
}
