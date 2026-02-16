import {
  BACK_LABEL,
  COMPANY_LEGAL_NAME,
  TERMS_EFFECTIVE_DATE,
  TERMS_PAGE_TITLE,
} from '../../constants'
import { BackArrow } from '../../components/icons'
import { Footer } from '../../components/Footer/Footer'
import { LegalSection } from '../../components/LegalSection/LegalSection'
import '../LegalPage/LegalPage.css'

type TermsPageProps = {
  onNavigate: (path: string) => (e: React.MouseEvent) => void
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
        <div className="privacy__content">
          <LegalSection number={1} title="THE AGREEMENT">
            These Terms of Use constitute a legally binding agreement between you ("Client" or "User") and {COMPANY_LEGAL_NAME}, also known as BeamUp Studios ("Company," "we," "us," or "our"). These terms govern your access to beamupstudios.com and any software, applications, or consulting services provided by the Company. By engaging the Company, you agree to be bound by these Terms.
          </LegalSection>
          <LegalSection number={2} title="FEES AND PAYMENT">
            All financial arrangements, including but not limited to project fees, hourly rates, payment schedules, and late interest, are governed strictly by the individual Statement of Work (SOW), signed contract, or engagement letter executed between the Company and the Client. In the event of any conflict between these Terms and a signed contract, the terms of the signed contract shall prevail regarding fees and payment only.
          </LegalSection>
          <LegalSection number={3} title="INTELLECTUAL PROPERTY & OWNERSHIP">
            <p><strong>3.1 Company IP:</strong> {COMPANY_LEGAL_NAME} retains exclusive ownership of all Background IP, including pre-existing code, proprietary frameworks, and development methodologies.</p>
            <p><strong>3.2 Conditional Transfer:</strong> Ownership of custom code ("Work Product") created specifically for a Client transfers to the Client ONLY upon the Company's receipt of full and final payment of all invoices as outlined in the Statement of Work.</p>
            <p><strong>3.3 Default:</strong> Failure to settle any invoice in full results in an immediate and automatic revocation of any license to use the Work Product. The Company reserves the right to disable, "kill-switch," or remove any software deployed for a Client who is in default of payment.</p>
          </LegalSection>
          <LegalSection number={4} title="TOTAL LIMITATION OF LIABILITY">
            TO THE MAXIMUM EXTENT PERMITTED BY THE LAWS OF ONTARIO AND CANADA:
            <p><strong>4.1 No Indirect Damages:</strong> In no event shall {COMPANY_LEGAL_NAME}, its directors, or employees be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, business interruption, or loss of goodwill, regardless of the cause of action.</p>
            <p><strong>4.2 Liability Cap:</strong> The total aggregate liability of the Company for any claim arising out of these Terms, the Services, or any consulting engagement, whether in contract, tort, or otherwise, shall be strictly limited to the lesser of $100.00 CAD or the actual amount paid by the Client to the Company for the specific deliverable giving rise to the claim.</p>
            <p><strong>4.3 "As-Is" Basis:</strong> All software and services are provided "as-is" and "as-available" without warranties of any kind, either express or implied. We do not warrant that our code is error-free or that it will meet specific business outcomes.</p>
          </LegalSection>
          <LegalSection number={5} title="INDEMNIFICATION">
            The Client shall defend, indemnify, and hold harmless {COMPANY_LEGAL_NAME} from and against any claims, damages, or legal fees arising from the Client's use of the software, any breach of these Terms, or any third-party claims resulting from the products built by the Company at the Client's direction.
          </LegalSection>
          <LegalSection number={6} title="NON-SOLICITATION">
            Client shall not solicit, hire, or contract any employee or agent of the Company for a period of 24 months following the termination of the most recent Statement of Work. Breach of this clause triggers a liquidated damages fee equal to 100% of the individual's annual compensation.
          </LegalSection>
          <LegalSection number={7} title="GOVERNING LAW">
            This Agreement is governed by the laws of the Province of Ontario and the federal laws of Canada. Parties irrevocably submit to the exclusive jurisdiction of the courts in Toronto, Ontario.
          </LegalSection>
        </div>
      </div>
      <Footer route="terms" onNavigate={onNavigate} />
    </>
  )
}
