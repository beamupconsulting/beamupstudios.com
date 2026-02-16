import { useState, useEffect } from 'react'
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

function App() {
  const [route, setRoute] = useState<Route>(getRoute)

  useEffect(() => {
    const onPopState = () => setRoute(getRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    window.history.pushState({}, '', path)
    setRoute(getRoute())
  }

  return (
    <Layout route={route} onNavigate={navigate}>
      {route === 'home' && <HomePage />}
      {route === 'privacy' && <PrivacyPage onNavigate={navigate} />}
      {route === 'terms' && <TermsPage onNavigate={navigate} />}
    </Layout>
  )
}

export default App
