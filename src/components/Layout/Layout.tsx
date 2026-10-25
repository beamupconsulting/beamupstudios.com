import { Cursor } from '../Cursor/Cursor'
import { Header } from '../Header/Header'
import './Layout.css'

type Route = 'home' | 'privacy' | 'terms'

type LayoutProps = {
  route: Route
  children: React.ReactNode
  onNavigate: (path: string) => (e: React.MouseEvent) => void
}

export function Layout({ route, children, onNavigate }: LayoutProps) {
  const pageClass = route === 'home' ? 'page page--home' : 'page page--legal'

  return (
    <div className={pageClass}>
      {route === 'home' && <Cursor />}
      {route !== 'home' && <Header onLogoClick={onNavigate('/')} />}
      <main className="page__main">{children}</main>
    </div>
  )
}
