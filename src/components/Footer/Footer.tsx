import {
  COMPANY_LEGAL_NAME,
  FOOTER_LINK_HOME,
  FOOTER_LINK_PRIVACY,
  FOOTER_LINK_TERMS,
  ROUTE_HOME,
  ROUTE_PRIVACY,
  ROUTE_TERMS,
} from '../../constants'
import './Footer.css'

type FooterProps = {
  route: 'home' | 'privacy' | 'terms'
  onNavigate: (path: string) => (e: React.MouseEvent) => void
}

const YEAR = new Date().getFullYear()

export function Footer({ route, onNavigate }: FooterProps) {
  return (
    <footer className="footer">
      {route !== 'home' && (
        <a href={ROUTE_HOME} onClick={onNavigate(ROUTE_HOME)}>
          {FOOTER_LINK_HOME}
        </a>
      )}
      {route !== 'privacy' && (
        <a href={ROUTE_PRIVACY} onClick={onNavigate(ROUTE_PRIVACY)}>
          {FOOTER_LINK_PRIVACY}
        </a>
      )}
      {route !== 'terms' && (
        <a href={ROUTE_TERMS} onClick={onNavigate(ROUTE_TERMS)}>
          {FOOTER_LINK_TERMS}
        </a>
      )}
      <span>
        © {YEAR} {COMPANY_LEGAL_NAME}
      </span>
    </footer>
  )
}
