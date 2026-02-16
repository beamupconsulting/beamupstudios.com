import { useState, useEffect } from 'react'
import './App.css'

const EMAIL = 'hello@beamupstudio.com'

function App() {
  const [copied, setCopied] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [heroHover, setHeroHover] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`page ${heroHover ? 'hero-hover' : ''}`}>
      <div
        className="custom-cursor"
        style={{ left: cursor.x, top: cursor.y }}
        aria-hidden
      />
      <div
        className="invert-spotlight"
        style={{ left: cursor.x, top: cursor.y }}
        aria-hidden
      />
      <header className="header">
        <a href="/" className="logo">BEAMUP STUDIOS</a>
        <nav className="nav">
          <a href="#works" className="nav-link">Works</a>
          <a href="#clients" className="nav-link">Clients</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-cta">
            Get Started
            <ArrowUpRight />
          </a>
        </nav>
      </header>

      <section className="hero">
        <div
          className="hero-inner"
          onMouseEnter={() => setHeroHover(true)}
          onMouseLeave={() => setHeroHover(false)}
        >
          <div className="profile-section">
            <div className="name-block">
              <h1 className="name-line">BEAMUP</h1>
              <h1 className="name-line">STUDIOS</h1>
            </div>
            <div className="hero-image-placeholder" aria-hidden />
          </div>
          <div className="bio-section">
            <div className="email-block">
              <a href={`mailto:${EMAIL}`} className="email">{EMAIL}</a>
              <button
                type="button"
                onClick={copyEmail}
                className="copy-btn"
                aria-label={copied ? 'Copied' : 'Copy email'}
                title={copied ? 'Copied' : 'Copy'}
              >
                <span className={`copy-btn-icon ${copied ? 'copy-btn-icon--hidden' : ''}`}>
                  <CopyIcon />
                </span>
                <span className={`copy-btn-icon copy-btn-icon--check ${copied ? '' : 'copy-btn-icon--hidden'}`}>
                  <CheckIcon />
                </span>
              </button>
            </div>
            <p className="bio">
              We’re a technical studio building high-performance software and digital tools. We partner with startups and enterprises to engineer scalable systems and internal products that bridge the gap between idea and launch. Let’s build the future together.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="copy-icon-svg">
      <path d="M13.89 1.668L1.668 1.668L1.668 13.89L13.89 13.89Z" />
      <path d="M17 6.11L18.332 6.11L18.332 18.332L6.109 18.332L6.109 17" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="copy-icon-svg">
      <path d="M4 10l4 4 8-8" />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="nav-cta-icon">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

export default App
