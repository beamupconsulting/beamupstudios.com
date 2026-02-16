import './LegalSection.css'

type LegalSectionProps = {
  number: number
  title: string
  children: React.ReactNode
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section className="privacy__section">
      <h2 className="privacy__section-title">
        {number}. {title}
      </h2>
      <div className="privacy__section-body">{children}</div>
    </section>
  )
}
