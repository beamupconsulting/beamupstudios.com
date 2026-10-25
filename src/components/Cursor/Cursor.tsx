import { useEffect, useRef } from 'react'

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    if (!fine || reduce || !root || !ring || !dot) return

    const pos = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    let frame = 0

    const place = (x: number, y: number) => {
      pos.x = x
      pos.y = y
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const onMove = (event: MouseEvent) => {
      document.documentElement.classList.add('has-reticle')
      root.classList.remove('is-off')
      place(event.clientX, event.clientY)
      const target = event.target
      const hot = target instanceof Element && Boolean(target.closest('a, button'))
      root.classList.toggle('is-hot', hot)
    }

    const onLeave = () => {
      root.classList.add('is-off')
    }

    const onDown = () => root.classList.add('is-down')
    const onUp = () => root.classList.remove('is-down')

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.22
      cur.y += (pos.y - cur.y) * 0.22
      ring.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-reticle')
    }
  }, [])

  return (
    <div ref={rootRef} className="reticle is-off" aria-hidden>
      <div ref={dotRef} className="reticle__dot">
        <span className="reticle__hair" />
      </div>
      <div ref={ringRef} className="reticle__ring">
        <span className="reticle__hair reticle__hair--ghost" />
      </div>
    </div>
  )
}
