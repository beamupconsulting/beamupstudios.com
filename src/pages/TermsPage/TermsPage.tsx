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
          This page covers the brand site only. Consulting follows its own agreement. A software product follows the terms on that product. This website is not a promise to pay anyone.
        </p>
        <div className="privacy__content">
          <LegalSection number={1} title="This website">
            <p>
              These terms are between you and {COMPANY_LEGAL_NAME} ("BeamUp," "we"). We publish {SITE_HOST} under the name {COMPANY_DISPLAY_NAME}. The site is the brand. It is not a software product and it is not a consulting agreement. If you use the site, you agree to these terms for the site only.
            </p>
          </LegalSection>

          <LegalSection number={2} title="Separate from everything else">
            <p>
              A consulting engagement is governed by the written agreement for that engagement. A software product is governed by the terms and privacy notice published for that product. If one of those documents and this page differ about that engagement or that product, that document wins.
            </p>
            <p>
              This page does not add terms to a product or an engagement, and those documents do not add terms to this site. A claim about one is not a claim about the other.
            </p>
          </LegalSection>

          <LegalSection number={3} title="Using the site">
            <p>
              The site is provided as is and as available. We can change it or take it down. You will not misuse it, probe it, or overload it. The only description of a paid project is the agreement for that project. An idea you send us without an agreement is not confidential, and we don't owe you anything for it. Personal information in a message is still handled under the <a href={ROUTE_PRIVACY} onClick={onNavigate(ROUTE_PRIVACY)}>Privacy Policy</a>.
            </p>
          </LegalSection>

          <LegalSection number={4} title="No liability">
            <p>
              To the fullest extent the law allows, {COMPANY_LEGAL_NAME} and its directors, officers, and contractors are not liable for anything arising out of this website or your use of it. That includes direct, indirect, incidental, special, consequential, and punitive damages, and lost profits, revenue, data, or business.
            </p>
            <p>
              If the law does not allow a complete exclusion, liability is limited to the smallest amount the law allows. Nothing on this site is an offer to pay you, reimburse you, or take on a dispute for you. A claim about a product or a consulting engagement is not a claim under these terms.
            </p>
          </LegalSection>

          <LegalSection number={5} title="Contact">
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
