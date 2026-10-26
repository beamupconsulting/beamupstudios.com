import { useEffect, useState } from 'react'
import { COMPANY_DISPLAY_NAME } from './constants'
import { Layout } from './components/Layout/Layout'
import { HomePage } from './pages/HomePage/HomePage'
import { PrivacyPage } from './pages/PrivacyPage/PrivacyPage'
import { TermsPage } from './pages/TermsPage/TermsPage'

type Route = 'home' | 'privacy' | 'terms'

function getRoute(): Route {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/privacy') return 'privacy'
  if (path === '/terms') return 'terms'
  return 'home'
}

const TITLES: Record<Route, string> = {
  home: COMPANY_DISPLAY_NAME,
  privacy: `Privacy Policy · ${COMPANY_DISPLAY_NAME}`,
  terms: `Terms of Service · ${COMPANY_DISPLAY_NAME}`,
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute)

  useEffect(() => {
    const onPopState = () => setRoute(getRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.title = TITLES[route]
    const id = window.location.hash.replace('#', '')
    const target = id ? document.getElementById(id) : null
    if (target) {
      target.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
    document.querySelector('.page__main')?.scrollTo(0, 0)
  }, [route])

  const navigate = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    window.history.pushState({}, '', path)
    setRoute(getRoute())
  }

  return (
    <Layout route={route} onNavigate={navigate}>
      {route === 'home' && <HomePage onNavigate={navigate} />}
      {route === 'privacy' && <PrivacyPage onNavigate={navigate} />}
      {route === 'terms' && <TermsPage onNavigate={navigate} />}
    </Layout>
  )
}

export default App
