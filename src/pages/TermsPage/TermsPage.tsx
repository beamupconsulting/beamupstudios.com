import {
  BACK_LABEL,
  COMPANY_DISPLAY_NAME,
  COMPANY_LEGAL_NAME,
  LEGAL_EMAIL,
  ROUTE_PRIVACY,
  SITE_HOST,
  SITE_URL,
  TERMS_EFFECTIVE_DATE,
  TERMS_PAGE_TITLE,
} from '../../constants'
import { BackArrow } from '../../components/icons'
import { Footer } from '../../components/Footer/Footer'
import { LegalSection } from '../../components/LegalSection/LegalSection'
import '../LegalPage/LegalPage.css'

type TermsPageProps = {
  onNavigate: (path: string) => (event: React.MouseEvent) => void
}

function mail(subject: string) {
  return `mailto:${LEGAL_EMAIL}?subject=${encodeURIComponent(subject)}`
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <>
      <div className="privacy">
        <a href="/" className="privacy__back" onClick={onNavigate('/')} aria-label="Back to home">
          <BackArrow />
          <span>{BACK_LABEL}</span>
        </a>
        <h1 className="privacy__title">{TERMS_PAGE_TITLE}</h1>
        <p className="privacy__updated">{TERMS_EFFECTIVE_DATE}</p>
        <p className="legal-note">
          This page covers the brand site only. Consulting engagements follow their own agreement. Software products follow the terms on that product. Disputes about this website go to individual arbitration, and class actions are waived, to the extent the law allows.
        </p>
        <div className="privacy__content">
          <LegalSection number={1} title="This website">
            <p>
              These terms are between you and {COMPANY_LEGAL_NAME} ("BeamUp," "we"). We publish {SITE_HOST} under the name {COMPANY_DISPLAY_NAME}. The site is the brand. It is not a software product and it is not a consulting agreement. If you use the site, you agree to these terms for the site only.
            </p>
          </LegalSection>

          <LegalSection number={2} title="Separate from everything else" id="separate">
            <p>
              A consulting engagement is governed by the written agreement for that engagement. A software product is governed by the terms and privacy notice published for that product. If one of those documents and this page ever differ about that engagement or that product, that document wins.
            </p>
            <p>
              This page does not add terms to a product or an engagement, and those documents do not add terms to this site. Payment for one is not payment for the other. A claim about one is not a claim about the other.
            </p>
          </LegalSection>

          <LegalSection number={3} title="Using the site">
            <p>
              The site is provided as is and as available. We can change it or take it down. You will not misuse it, probe it, or overload it. The only description of a paid project is the agreement for that project. An idea you send us without an agreement is not confidential, and we don't owe you anything for it. Personal information in a message is still handled under the <a href={ROUTE_PRIVACY} onClick={onNavigate(ROUTE_PRIVACY)}>Privacy Policy</a>.
            </p>
          </LegalSection>

          <LegalSection number={4} title="Liability for this website" id="liability">
            <p>
              To the maximum extent the law allows, we and our directors, officers, and contractors are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, data, or business, arising out of this website.
            </p>
            <p>
              Our total liability arising out of this website is CAD $100. That cap does not apply to liability the law does not allow us to limit, including fraud and willful misconduct. A claim about a product or a consulting engagement is not a claim under these terms. If a court treats it as one anyway, the cap for that claim is CAD $100.
            </p>
          </LegalSection>

          <LegalSection number={5} title="Disputes about this website" id="disputes">
            <p>
              This section is only about this website. A dispute about a product or a consulting engagement follows the document that governs it.
            </p>
            <p>
              Before filing, email <a href={mail('Dispute notice')}>{LEGAL_EMAIL}</a> with the subject "Dispute notice" and give us 30 days. Except where a statute gives you a non-waivable right to sue in court, the dispute is then resolved by confidential, individual arbitration in Toronto, Ontario, in English, before one arbitrator, under the Arbitration Act, 1991 (Ontario) and the ADR Institute of Canada rules. No class, collective, or representative proceeding, to the extent the law allows.
            </p>
            <p>
              You can opt out of arbitration within 30 days of first visiting the site by emailing <a href={mail('Arbitration opt-out')}>{LEGAL_EMAIL}</a> with the subject "Arbitration opt-out" and your name and address. An individual claim that qualifies can still go to small claims court in Toronto. If you are an individual, or the claim is under CAD $25,000, we pay the arbitration fees above what it would cost to file in the Ontario Superior Court of Justice.
            </p>
            <p>
              Ontario law and the federal laws of Canada govern. If a claim is not arbitrated, the courts of Toronto have exclusive jurisdiction. If a statute forbids the class waiver or the arbitration for a particular claim, that claim goes to those courts and the rest of this section still applies.
            </p>
          </LegalSection>

          <LegalSection number={6} title="Contact">
            <p>
              {COMPANY_LEGAL_NAME}
              <br />
              <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
              <br />
              {SITE_URL}
            </p>
          </LegalSection>
        </div>
      </div>
      <Footer route="terms" onNavigate={onNavigate} />
    </>
  )
}
