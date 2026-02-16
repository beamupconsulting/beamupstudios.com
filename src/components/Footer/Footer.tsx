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

const CURRENT_YEAR = new Date().getFullYear()

export function Footer({ route, onNavigate }: FooterProps) {
  if (route === 'home') {
    return (
      <footer className="footer">
        <a href={ROUTE_PRIVACY} className="footer__link" onClick={onNavigate(ROUTE_PRIVACY)}>
          {FOOTER_LINK_PRIVACY}
        </a>
        <span className="footer__sep">·</span>
        <a href={ROUTE_TERMS} className="footer__link" onClick={onNavigate(ROUTE_TERMS)}>
          {FOOTER_LINK_TERMS}
        </a>
        <span className="footer__sep">·</span>
        <span>© {CURRENT_YEAR} {COMPANY_LEGAL_NAME}</span>
      </footer>
    )
  }

  return (
    <footer className="footer">
      <a href={ROUTE_HOME} className="footer__link" onClick={onNavigate(ROUTE_HOME)}>
        {FOOTER_LINK_HOME}
      </a>
      <span className="footer__sep">·</span>
      <span>© {CURRENT_YEAR} {COMPANY_LEGAL_NAME}</span>
    </footer>
  )
}
