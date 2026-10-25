import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

const KNEE = 0.38
const TAIL = 1 - KNEE
const CUBIC = 8 / 3
const EFFORT_MAX = KNEE + TAIL * (1 + CUBIC)

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

function hashJump() {
  const hash = window.location.hash
  return hash === '#spec' || hash === '#contact'
}

function toProgress(energy: number, reduced: boolean) {
  const t = Math.min(1, Math.max(0, energy))
  if (reduced) return t
  const target = t * EFFORT_MAX
  if (target <= KNEE) return target
  const uTarget = (target - KNEE) / TAIL
  let lo = 0
  let hi = 1
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) * 0.5
    const f = mid + CUBIC * mid * mid * mid
    if (f < uTarget) lo = mid
    else hi = mid
  }
  return KNEE + TAIL * ((lo + hi) * 0.5)
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
  const jumped = hashJump()
  const progress = useRef(jumped ? 1 : 0)
  const push = useRef(0)
  const energyRef = useRef(jumped ? 1 : 0)
  const stageRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const nudge = useRef<(amount: number) => void>(() => {})

  const reset = useCallback(() => {
    energyRef.current = 0
    const plate = plateRef.current
    if (plate) plate.scrollTop = 0
  }, [])

  useLayoutEffect(() => {
    const stage = stageRef.current
    const hero = heroRef.current
    const plate = plateRef.current
    if (!stage || !hero || !plate) return

    const reduced = prefersReducedMotion()
    let shown = progress.current
    let heroOn = shown < 0.4
    let plateOn = shown > 0.5
    let frame = 0

    const paintFlags = (nextHero: boolean, nextPlate: boolean) => {
      if (nextHero !== heroOn) {
        heroOn = nextHero
        hero.style.pointerEvents = nextHero ? 'auto' : 'none'
        hero.inert = !nextHero
        hero.setAttribute('aria-hidden', nextHero ? 'false' : 'true')
      }
      if (nextPlate !== plateOn) {
        plateOn = nextPlate
        plate.style.pointerEvents = nextPlate ? 'auto' : 'none'
        plate.inert = !nextPlate
        plate.setAttribute('aria-hidden', nextPlate ? 'false' : 'true')
      }
    }

    const travel = () => {
      const screens = reduced ? 1.15 : window.innerWidth < 820 ? 3.1 : 4.1
      return window.innerHeight * screens
    }

    const apply = (dy: number) => {
      const overflow = plate.scrollHeight - plate.clientHeight > 4
      const atEnd = energyRef.current >= 0.999 && shown > 0.97
      if (overflow) {
        if (dy > 0 && atEnd) {
          plate.scrollTop += dy
          return
        }
        if (dy < 0 && plate.scrollTop > 0) {
          const next = plate.scrollTop + dy
          if (next > 0) {
            plate.scrollTop = next
            return
          }
          plate.scrollTop = 0
          dy = next
        }
      }
      const cap = window.innerHeight * 0.5
      const clamped = Math.max(-cap, Math.min(cap, dy))
      energyRef.current = Math.min(1, Math.max(0, energyRef.current + clamped / travel()))
      push.current = Math.min(1, push.current + Math.min(1, Math.abs(clamped) / 80) * 0.65)
    }

    nudge.current = (amount) => apply(amount * travel())

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      event.preventDefault()
      let dy = event.deltaY
      if (event.deltaMode === 1) dy *= 16
      if (event.deltaMode === 2) dy *= window.innerHeight
      apply(dy)
    }

    let touchY = 0
    let touchX = 0
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      touchY = touch.clientY
      touchX = touch.clientX
    }
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      const dy = touchY - touch.clientY
      const dx = touch.clientX - touchX
      touchY = touch.clientY
      touchX = touch.clientX
      if (Math.abs(dx) > Math.abs(dy)) return
      event.preventDefault()
      apply(dy)
    }

    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        if ((tag === 'BUTTON' || tag === 'A') && event.key === ' ') return
      }
      const steps: Record<string, number> = {
        ArrowDown: 0.045,
        ArrowUp: -0.045,
        PageDown: 0.14,
        PageUp: -0.14,
        ' ': 0.07,
      }
      if (event.key === 'Home') {
        event.preventDefault()
        energyRef.current = 0
        plate.scrollTop = 0
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        energyRef.current = 1
        push.current = 1
        return
      }
      const step = steps[event.key]
      if (step === undefined) return
      event.preventDefault()
      apply(step * travel())
    }

    paintFlags(shown < 0.4, shown > 0.5)
    stage.style.setProperty('--p', shown.toFixed(4))

    const tick = () => {
      const target = toProgress(energyRef.current, reduced)
      const k = reduced ? 1 : 0.16
      shown += (target - shown) * k
      if (Math.abs(target - shown) < 0.0004) shown = target
      progress.current = shown
      push.current *= 0.9
      stage.style.setProperty('--p', shown.toFixed(4))
      paintFlags(shown < 0.4, shown > 0.52)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', onWheel, true)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="home">
      <section className="stage" ref={stageRef}>
        <BeamScene progress={progress} push={push} />
        <div className="scrim" aria-hidden />
        <div className="crops" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="stage__ui">
          <div className="stage__top">
            <a
              href="/"
              className="mark"
              onClick={(event) => {
                onNavigate('/')(event)
                reset()
              }}
            >
              <span className="mark__name">{COMPANY_MARK}</span>
              <span className="mark__sub">Studios</span>
            </a>
            <a className="stage__mail" href={`mailto:${EMAIL}`}>
              <span className="mail-full">{EMAIL}</span>
              <span className="mail-short">Write</span>
            </a>
          </div>
          <div className="stage__mid">
            <div className="hero-block" ref={heroRef}>
              <h1 className="hero__title">
                BEAMUP
                <span>STUDIOS</span>
              </h1>
              <p className="hero__sub">The technical engine for software that ships.</p>
              <button type="button" className="hint" onClick={() => nudge.current(0.12)}>
                <span className="hint__line" aria-hidden />
                Scroll
              </button>
            </div>
            <div className="plate-block" id="spec" ref={plateRef}>
              <div className="plate-block__inner">
                <p className="kicker">Studio</p>
                <h2>What we do.</h2>
                <p className="dek">
                  Beamup Studios is a technical engine. We build the software, we work inside other teams, and we ship
                  products of our own.
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
