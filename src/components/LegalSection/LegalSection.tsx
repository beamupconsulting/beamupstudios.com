import './LegalSection.css'

type LegalSectionProps = {
  number: number
  title: string
  children: React.ReactNode
  id?: string
}

export function LegalSection({ number, title, children, id }: LegalSectionProps) {
  return (
    <section className="privacy__section" id={id}>
      <h2 className="privacy__section-title">
        <span>{String(number).padStart(2, '0')}</span>
        {title}
      </h2>
      <div className="privacy__section-body">{children}</div>
    </section>
  )
}
