import { useState, useEffect } from 'react'
import './App.css'

const EMAIL = 'beamupconsultinginc@gmail.com'

function getRoute(): 'home' | 'privacy' | 'terms' {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/privacy') return 'privacy'
  if (path === '/terms') return 'terms'
  return 'home'
}

function App() {
  const [copied, setCopied] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [heroHover, setHeroHover] = useState(false)
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

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

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goHome = navigate('/')

  return (
    <div className={`page ${heroHover ? 'hero-hover' : ''}`}>
      <div className="custom-cursor" style={{ left: cursor.x, top: cursor.y }} aria-hidden />
      <div className="invert-spotlight" style={{ left: cursor.x, top: cursor.y }} aria-hidden />

      <header className="header">
        <a href="/" className="logo" onClick={goHome}>BEAMUP STUDIOS</a>
        <nav className="nav">
          <a href="https://calendar.app.google/9jUMDRdpNsUdYp3C8" target="_blank" className="nav-cta">
            Get Started
            <ArrowUpRight />
          </a>
        </nav>
      </header>

      <main className={`page__main ${route === 'privacy' || route === 'terms' ? 'page__main--scroll' : ''}`}>
        {route === 'home' && (
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
                  We're a technical studio building high-performance software and digital tools. We partner with startups and enterprises to engineer scalable systems and internal products that bridge the gap between idea and launch. Let's build the future together.
                </p>
              </div>
            </div>
          </section>
        )}

        {route === 'privacy' && (
          <>
            <div className="privacy">
              <a href="/" className="privacy__back" onClick={goHome} aria-label="Back to home">
                <BackArrow />
                <span>Back</span>
              </a>
              <h1 className="privacy__title">PRIVACY POLICY</h1>
              <p className="privacy__updated">Last Updated: October 20, 2026</p>
            <div className="privacy__content">
              <PrivacySection number={1} title="INTRODUCTION AND SCOPE">
                This Privacy Policy (the "Policy") describes how BeamUp Consulting Inc., operating and also known as BeamUp Studios ("we," "us," "our," or the "Company"), collects, uses, and discloses information in the course of operating our website (beamupstudios.com), delivering freelance software engineering services, and providing web or mobile applications (collectively, the "Services").
                <p>By accessing our website, engaging us for consulting, or using any software built by us, you acknowledge that you have read and understood this Policy and agree to the collection and use of information as described herein. If you do not agree to these terms, you must immediately cease all use of our Services.</p>
              </PrivacySection>
              <PrivacySection number={2} title="BROAD SPECTRUM DATA COLLECTION">
                To provide the most robust de-risking possible, you acknowledge that the Company may collect, and you consent to the collection of, the following categories of data, whether collected explicitly or incidentally through standard server operations:
                <ul>
                  <li><strong>Identity and Contact Data:</strong> Including but not limited to names, email addresses, phone numbers, and business identifiers.</li>
                  <li><strong>Technical and Usage Data:</strong> Including IP addresses, browser types, device identifiers, time zones, operating systems, referral sources, length of visit, page views, and website navigation paths.</li>
                  <li><strong>Log Data:</strong> Our servers automatically record information ("Log Data") which may include information such as your device's Internet Protocol ("IP") address, browser version, the pages of our Services that you visit, the time and date of your visit, and other statistics.</li>
                  <li><strong>Interactions and Feedback:</strong> Any communications, support requests, or feedback provided directly to the Company.</li>
                  <li><strong>Incidental Metadata:</strong> Any data points generated through the use of modern development frameworks, API calls, or third-party integrations that may be captured during the software development lifecycle.</li>
                </ul>
              </PrivacySection>
              <PrivacySection number={3} title="THIRD-PARTY INFRASTRUCTURE RELIANCE">
                The Company does not maintain its own physical data centers. We rely on third-party "Best-in-Class" infrastructure providers, including but not limited to Amazon Web Services (AWS), Vercel, Stripe, and GitHub.
                <ul>
                  <li><strong>No Direct Management:</strong> You acknowledge that we do not have direct control over the physical security or internal data-handling protocols of these third-party providers.</li>
                  <li><strong>Liability Waiver:</strong> The Company assumes zero liability for any data breach, leak, or corruption occurring at the infrastructure level. Your sole recourse for such events lies with the respective third-party provider.</li>
                  <li><strong>International Transfers:</strong> Data may be transferred to, and maintained on, computers located outside of Ontario and Canada, where privacy laws may not be as protective. Your consent to this Policy represents your agreement to that transfer.</li>
                </ul>
              </PrivacySection>
              <PrivacySection number={4} title="PURPOSE OF DATA PROCESSING">
                We use the collected information for broad business purposes to ensure maximum operational flexibility:
                <ul>
                  <li>To provide, maintain, and improve our software and consulting services.</li>
                  <li>To process transactions and manage project milestones.</li>
                  <li>To monitor and analyze usage patterns and technical trends.</li>
                  <li>To detect, prevent, and address technical issues or security vulnerabilities.</li>
                  <li>To comply with legal obligations under the laws of Ontario and the federal laws of Canada.</li>
                </ul>
              </PrivacySection>
              <PrivacySection number={5} title="DATA RETENTION AND DISPOSAL">
                The Company will retain your personal information only for as long as is necessary for the purposes set out in this Policy. We make no specific representations regarding the definitive timeline for data disposal. You acknowledge that "backups" or "cached versions" of data may persist in third-party systems or developer environments even after a deletion request has been processed.
              </PrivacySection>
              <PrivacySection number={6} title={'NO GUARANTEE OF SECURITY ("AS-IS" HANDLING)'}>
                While we implement standard security measures, you acknowledge that no method of transmission over the Internet, or method of electronic storage, is 100% secure.
                <p><strong>High-Risk Acknowledgment:</strong> You use our Services at your own risk. The Company does not warrant that its data handling is "fail-safe" or "unbreakable."</p>
                <p><strong>No Liability for Negligence:</strong> To the extent permitted by Ontario law, the Company is not liable for data exposure resulting from unintended software bugs, zero-day vulnerabilities, or administrative errors.</p>
              </PrivacySection>
              <PrivacySection number={7} title="YOUR RIGHTS UNDER PIPEDA">
                In accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to request access to the personal information we hold about you.
                <ul>
                  <li><strong>Verification Requirement:</strong> To protect against unauthorized access, we will require rigorous proof of identity before processing any data request.</li>
                  <li><strong>Limited Remedy:</strong> Your sole remedy for any dissatisfaction with our data practices is the deletion of your account and the cessation of use of our Services.</li>
                </ul>
              </PrivacySection>
              <PrivacySection number={8} title="INDEMNIFICATION BY CLIENTS">
                For consulting engagements, the Client warrants that they have the legal right to provide any data to BeamUp Consulting Inc. for the purpose of development. The Client shall indemnify, defend, and hold the Company harmless from any and all third-party claims, losses, or regulatory fines arising from the Client's data collection or the deployment of software built by the Company.
              </PrivacySection>
              <PrivacySection number={9} title="CHANGES TO THIS POLICY">
                We reserve the right to update or change our Privacy Policy at any time. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
              </PrivacySection>
              <PrivacySection number={10} title="CONTACT INFORMATION">
                For any legal inquiries regarding these terms, contact:
                <p className="privacy__contact">
                  BeamUp Consulting Inc.<br />
                  <a href="mailto:beamupconsultinginc@gmail.com">beamupconsultinginc@gmail.com</a>
                </p>
              </PrivacySection>
            </div>
            </div>

            <footer className="footer">
              <a href="/" className="footer__link" onClick={goHome}>Home</a>
              <span className="footer__sep">·</span>
              <span>© {new Date().getFullYear()} BeamUp Consulting Inc.</span>
            </footer>
          </>
        )}

        {route === 'terms' && (
          <>
            <div className="privacy">
              <a href="/" className="privacy__back" onClick={goHome} aria-label="Back to home">
                <BackArrow />
                <span>Back</span>
              </a>
              <h1 className="privacy__title">TERMS OF USE</h1>
              <p className="privacy__updated">Effective Date: January 1, 2026</p>
              <div className="privacy__content">
                <PrivacySection number={1} title="THE AGREEMENT">
                  These Terms of Use constitute a legally binding agreement between you ("Client" or "User") and BeamUp Consulting Inc., also known as BeamUp Studios ("Company," "we," "us," or "our"). These terms govern your access to beamupstudios.com and any software, applications, or consulting services provided by the Company. By engaging the Company, you agree to be bound by these Terms.
                </PrivacySection>
                <PrivacySection number={2} title="FEES AND PAYMENT">
                  All financial arrangements, including but not limited to project fees, hourly rates, payment schedules, and late interest, are governed strictly by the individual Statement of Work (SOW), signed contract, or engagement letter executed between the Company and the Client. In the event of any conflict between these Terms and a signed contract, the terms of the signed contract shall prevail regarding fees and payment only.
                </PrivacySection>
                <PrivacySection number={3} title="INTELLECTUAL PROPERTY & OWNERSHIP">
                  <p><strong>3.1 Company IP:</strong> BeamUp Consulting Inc. retains exclusive ownership of all Background IP, including pre-existing code, proprietary frameworks, and development methodologies.</p>
                  <p><strong>3.2 Conditional Transfer:</strong> Ownership of custom code ("Work Product") created specifically for a Client transfers to the Client ONLY upon the Company's receipt of full and final payment of all invoices as outlined in the Statement of Work.</p>
                  <p><strong>3.3 Default:</strong> Failure to settle any invoice in full results in an immediate and automatic revocation of any license to use the Work Product. The Company reserves the right to disable, "kill-switch," or remove any software deployed for a Client who is in default of payment.</p>
                </PrivacySection>
                <PrivacySection number={4} title="TOTAL LIMITATION OF LIABILITY">
                  TO THE MAXIMUM EXTENT PERMITTED BY THE LAWS OF ONTARIO AND CANADA:
                  <p><strong>4.1 No Indirect Damages:</strong> In no event shall BeamUp Consulting Inc., its directors, or employees be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, business interruption, or loss of goodwill, regardless of the cause of action.</p>
                  <p><strong>4.2 Liability Cap:</strong> The total aggregate liability of the Company for any claim arising out of these Terms, the Services, or any consulting engagement, whether in contract, tort, or otherwise, shall be strictly limited to the lesser of $100.00 CAD or the actual amount paid by the Client to the Company for the specific deliverable giving rise to the claim.</p>
                  <p><strong>4.3 "As-Is" Basis:</strong> All software and services are provided "as-is" and "as-available" without warranties of any kind, either express or implied. We do not warrant that our code is error-free or that it will meet specific business outcomes.</p>
                </PrivacySection>
                <PrivacySection number={5} title="INDEMNIFICATION">
                  The Client shall defend, indemnify, and hold harmless BeamUp Consulting Inc. from and against any claims, damages, or legal fees arising from the Client's use of the software, any breach of these Terms, or any third-party claims resulting from the products built by the Company at the Client's direction.
                </PrivacySection>
                <PrivacySection number={6} title="NON-SOLICITATION">
                  Client shall not solicit, hire, or contract any employee or agent of the Company for a period of 24 months following the termination of the most recent Statement of Work. Breach of this clause triggers a liquidated damages fee equal to 100% of the individual's annual compensation.
                </PrivacySection>
                <PrivacySection number={7} title="GOVERNING LAW">
                  This Agreement is governed by the laws of the Province of Ontario and the federal laws of Canada. Parties irrevocably submit to the exclusive jurisdiction of the courts in Toronto, Ontario.
                </PrivacySection>
              </div>
            </div>
            <footer className="footer">
              <a href="/" className="footer__link" onClick={goHome}>Home</a>
              <span className="footer__sep">·</span>
              <span>© {new Date().getFullYear()} BeamUp Consulting Inc.</span>
            </footer>
          </>
        )}
      </main>

      {route === 'home' && (
        <footer className="footer">
          <a href="/privacy" className="footer__link" onClick={navigate('/privacy')}>Privacy Policy</a>
          <span className="footer__sep">·</span>
          <a href="/terms" className="footer__link" onClick={navigate('/terms')}>Terms of Service</a>
          <span className="footer__sep">·</span>
          <span>© {new Date().getFullYear()} BeamUp Consulting Inc.</span>
        </footer>
      )}
    </div>
  )
}

function PrivacySection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="privacy__section">
      <h2 className="privacy__section-title">{number}. {title}</h2>
      <div className="privacy__section-body">{children}</div>
    </section>
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

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="nav-back__icon">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}

export default App
