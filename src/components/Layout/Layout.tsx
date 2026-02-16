import { useState, useEffect } from 'react'
import { BULLET_JOURNAL_BACKGROUND } from '../../constants'
import { Cursor } from '../Cursor/Cursor'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import './Layout.css'

type Route = 'home' | 'privacy' | 'terms'

type LayoutProps = {
  route: Route
  children: React.ReactNode
  onNavigate: (path: string) => (e: React.MouseEvent) => void
}

export function Layout({ route, children, onNavigate }: LayoutProps) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const isScrollableMain = route === 'privacy' || route === 'terms'

  const pageClass = [
    'page',
    'hero-hover',
    BULLET_JOURNAL_BACKGROUND && 'page--bujo',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={pageClass}>
      <Cursor x={cursor.x} y={cursor.y} />
      <Header onLogoClick={onNavigate('/')} />
      <main className={`page__main ${isScrollableMain ? 'page__main--scroll' : ''}`}>
        {children}
      </main>
      {route === 'home' && <Footer route={route} onNavigate={onNavigate} />}
    </div>
  )
}
