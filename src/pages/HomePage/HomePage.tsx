import { useState } from 'react'
import { EMAIL, BIO_TEXT, HERO_NAME_LINES } from '../../constants'
import { CopyIcon, CheckIcon } from '../../components/icons'
import './HomePage.css'

export function HomePage() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="profile-section">
          <div className="name-block">
            {HERO_NAME_LINES.map((line) => (
              <h1 key={line} className="name-line">
                {line}
              </h1>
            ))}
          </div>
          <div className="hero-image-placeholder" aria-hidden />
        </div>
        <div className="bio-section">
          <div className="email-block">
            <a href={`mailto:${EMAIL}`} target="_blank" className="email">
              {EMAIL}
            </a>
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
          <p className="bio">{BIO_TEXT}</p>
        </div>
      </div>
    </section>
  )
}
