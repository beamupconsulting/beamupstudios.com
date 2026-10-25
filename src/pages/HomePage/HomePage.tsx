import { useCallback, useEffect, useRef, useState } from 'react'
import { BeamScene } from '../../components/BeamScene/BeamScene'
import {
  COMPANY_LEGAL_NAME,
  COMPANY_MARK,
  EMAIL,
  FOOTER_LINK_PRIVACY,
  FOOTER_LINK_TERMS,
  NAV_CTA_LABEL,
  NAV_CTA_URL,
  ROUTE_PRIVACY,
  ROUTE_TERMS,
} from '../../constants'
import './HomePage.css'

type HomePageProps = {
  onNavigate: (path: string) => (event: React.MouseEvent) => void
}

const YEAR = new Date().getFullYear()

const SPEC = [
  {
    index: '01',
    title: 'Engineering',
    body: 'Design and development of the product itself. The systems underneath, the interface on top, and the work of taking it from a sketch to something people actually use.',
  },
  {
    index: '02',
    title: 'Consulting',
    body: 'We join teams that are already shipping. Architecture, the build, and the technical decisions that show up once the work is real.',
  },
  {
    index: '03',
    title: 'Apps',
    body: 'Software we make and publish ourselves, held to the same standard as the work we do for everyone else.',
  },
] as const

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const field = document.createElement('textarea')
    field.value = value
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.left = '-9999px'
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    field.remove()
  }
}

function Clock() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const tick = () => {
      node.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false })
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span ref={ref} className="clock">
      --:--:--
    </span>
  )
}

function Acquire({ onDone }: { onDone: () => void }) {
  const veilRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone()
      return
    }

    const veil = veilRef.current
    if (!veil) return

    document.body.style.overflow = 'hidden'
    const start = performance.now()
    const duration = 1750
    let frame = 0
    let timeout = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const originX = window.innerWidth * 0.5
      const originY = window.innerHeight * 0.42
      const radius =
        Math.max(
          Math.hypot(originX, originY),
          Math.hypot(window.innerWidth - originX, originY),
          Math.hypot(originX, window.innerHeight - originY),
          Math.hypot(window.innerWidth - originX, window.innerHeight - originY),
        ) + 16
      veil.style.setProperty('--r', `${eased * radius}px`)
      veil.style.setProperty('--ring-a', String(1 - t * 0.85))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      veil.classList.add('is-out')
      onDone()
      document.body.style.overflow = ''
      timeout = window.setTimeout(() => setDone(true), 480)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
      document.body.style.overflow = ''
    }
  }, [onDone])

  if (done) return null

  return (
    <div ref={veilRef} className="veil" aria-hidden>
      <div className="veil__sweep" />
      <div className="veil__ring" />
    </div>
  )
}

function CopyButton() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  return (
    <button
      type="button"
      className="ctrl"
      aria-live="polite"
      onClick={() => {
        void copyText(EMAIL).then(() => setCopied(true))
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function HomePage({ onNavigate }: HomePageProps) {
  const pointer = useRef({ x: 0, y: 0 })
  const progress = useRef(0)
  const xRef = useRef<HTMLSpanElement>(null)
  const yRef = useRef<HTMLSpanElement>(null)
  const [ready, setReady] = useState(prefersReducedMotion)
  const finish = useCallback(() => setReady(true), [])

  useEffect(() => {
    const format = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
    let frame = 0
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    const paint = () => {
      if (xRef.current) xRef.current.textContent = format(pointer.current.x)
      if (yRef.current) yRef.current.textContent = format(pointer.current.y)
      frame = requestAnimationFrame(paint)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(paint)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="home">
      <section className="stage">
        <BeamScene pointer={pointer} progress={progress} />
        <div className="vignette" aria-hidden />
        <div className="crops" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="stage__ui">
          <div className="stage__top">
            <a href="/" className="mark" onClick={onNavigate('/')}>
              <span className="mark__name">{COMPANY_MARK}</span>
              <span className="mark__sub">Studios</span>
            </a>
            <div className="readout" aria-hidden>
              <span>Local</span>
              <Clock />
              <span className="readout__status">{ready ? 'Standby' : 'Acquire'}</span>
            </div>
            <a className="stage__mail" href={`mailto:${EMAIL}`}>
              <span className="mail-full">{EMAIL}</span>
              <span className="mail-short">Write</span>
            </a>
          </div>
          <div className="stage__bottom">
            <div className="stage__lead">
              <h1 className="hero__title">
                BEAMUP
                <span>STUDIOS</span>
              </h1>
              <p className="hero__sub">The technical engine for software that ships.</p>
            </div>
            <div className="stage__meta">
              <a className="hint" href="#spec">
                <span className="hint__line" aria-hidden />
                Scroll
              </a>
              <p className="coords" aria-hidden>
                <span>
                  X <b ref={xRef}>+0.00</b>
                </span>
                <span>
                  Y <b ref={yRef}>+0.00</b>
                </span>
              </p>
            </div>
          </div>
        </div>
        <Acquire onDone={finish} />
      </section>

      <section className="plate" id="spec">
        <div className="plate__inner">
          <p className="kicker">Studio</p>
          <h2 id="spec-title">What we do.</h2>
          <p className="dek">
            Beamup Studios is a technical engine. We build the software, we work inside other teams, and we ship products of our own.
          </p>
          <div className="spec">
            {SPEC.map((row) => (
              <article key={row.index} className="spec__row">
                <span className="spec__index">{row.index}</span>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </article>
            ))}
          </div>

          <div className="signal" id="contact">
            <p className="kicker">Contact</p>
            <a className="signal__mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <div className="signal__actions">
              <CopyButton />
              <a className="ctrl ctrl--solid" href={NAV_CTA_URL} target="_blank" rel="noopener noreferrer">
                {NAV_CTA_LABEL}
              </a>
            </div>
            <p className="signal__meta">Opens a Google scheduling page.</p>
          </div>

          <footer className="colophon">
            <p>
              © {YEAR} {COMPANY_LEGAL_NAME}
            </p>
            <p className="colophon__links">
              <a href={ROUTE_PRIVACY} onClick={onNavigate(ROUTE_PRIVACY)}>
                {FOOTER_LINK_PRIVACY}
              </a>
              <a href={ROUTE_TERMS} onClick={onNavigate(ROUTE_TERMS)}>
                {FOOTER_LINK_TERMS}
              </a>
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}
