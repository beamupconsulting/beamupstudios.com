type CursorProps = {
  x: number
  y: number
}

export function Cursor({ x, y }: CursorProps) {
  return (
    <>
      <div
        className="custom-cursor"
        style={{ left: x, top: y }}
        aria-hidden
      />
      <div
        className="invert-spotlight"
        style={{ left: x, top: y }}
        aria-hidden
      />
    </>
  )
}
