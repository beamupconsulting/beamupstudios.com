import {
  BACK_LABEL,
  COMPANY_DISPLAY_NAME,
  COMPANY_LEGAL_NAME,
  EMAIL,
  GOOGLE_PRIVACY_URL,
  LEGAL_EMAIL,
  META_PRIVACY_URL,
  OPC_URL,
  PRIVACY_LAST_UPDATED,
  PRIVACY_PAGE_TITLE,
  SITE_HOST,
} from '../../constants'
import { BackArrow } from '../../components/icons'
import { Footer } from '../../components/Footer/Footer'
import { LegalSection } from '../../components/LegalSection/LegalSection'
import '../LegalPage/LegalPage.css'

type PrivacyPageProps = {
  onNavigate: (path: string) => (event: React.MouseEvent) => void
}

function mail(subject: string) {
  return `mailto:${LEGAL_EMAIL}?subject=${encodeURIComponent(subject)}`
}

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <>
      <div className="privacy">
        <a href="/" className="privacy__back" onClick={onNavigate('/')} aria-label="Back to home">
          <BackArrow />
          <span>{BACK_LABEL}</span>
        </a>
        <h1 className="privacy__title">{PRIVACY_PAGE_TITLE}</h1>
        <p className="privacy__updated">{PRIVACY_LAST_UPDATED}</p>
        <p className="legal-note">
          This policy covers {SITE_HOST} only. A software product is covered by the privacy notice on that product. A consulting engagement is covered by the agreement for that engagement. This site does not use advertising pixels.
        </p>
        <div className="privacy__content">
          <LegalSection number={1} title="This website only">
            <p>
              {COMPANY_LEGAL_NAME} ("BeamUp," "we") publishes this website under the name {COMPANY_DISPLAY_NAME}. This policy describes personal information we handle through {SITE_HOST} and through messages about the studio.
            </p>
            <p>
              It does not describe a software product, and it does not describe a consulting engagement. Those have their own privacy notices and agreements. If one of those documents and this policy differ about that product or that engagement, that document wins.
            </p>
          </LegalSection>

          <LegalSection number={2} title="What this site collects">
            <ul>
              <li>
                <strong>Email.</strong> If you write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>, we receive whatever you put in the message so we can reply. The gmail address is a Google mailbox.
              </li>
              <li>
                <strong>Booking.</strong> "Book a call" opens a scheduling page Google operates. From there, Google's <Out href={GOOGLE_PRIVACY_URL}>privacy policy</Out> applies. We receive the booking details Google shares with us.
              </li>
              <li>
                <strong>Server logs.</strong> The host may record an IP address, the time, the browser, and the URL requested, so the page can be delivered and so we can deal with abuse. We keep those logs for up to 90 days unless we need one longer for a security incident.
              </li>
            </ul>
            <p>
              This website does not use advertising pixels, analytics products, session replay, or advertising cookies. We do not sell personal information from this site, and we do not share it for cross-context behavioral advertising. We keep studio correspondence for up to 24 months unless a legal claim requires longer.
            </p>
          </LegalSection>

          <LegalSection number={3} title="Products and ads" id="advertising">
            <p>
              Software we publish may use advertising and measurement tools, including tools from Meta Platforms, Inc. and its affiliates (Facebook and Instagram) and similar providers. What those tools receive, and the choices you have, are described in that product's privacy notice. Meta's policy is at <Out href={META_PRIVACY_URL}>facebook.com/privacy/policy</Out>.
            </p>
            <p>This policy is not that notice, and it is not consent to tracking on a product. This website does not load those tools.</p>
          </LegalSection>

          <LegalSection number={4} title="Your requests">
            <p>
              You can ask us what we hold about you from this website, ask us to correct it, or ask us to delete it, by emailing <a href={mail('Privacy request')}>{LEGAL_EMAIL}</a> with the subject "Privacy request." We will verify that the request is yours. California residents can use the same address to ask us to confirm that we do not sell or share personal information from this site.
            </p>
            <p>
              You can complain to the Office of the Privacy Commissioner of Canada at <Out href={OPC_URL}>priv.gc.ca</Out>. This site is not directed at anyone under 16, and we do not knowingly collect their information.
            </p>
          </LegalSection>

          <LegalSection number={5} title="Contact">
            <p>
              {COMPANY_LEGAL_NAME}
              <br />
              <a href={mail('Privacy request')}>{LEGAL_EMAIL}</a>
            </p>
          </LegalSection>
        </div>
      </div>
      <Footer route="privacy" onNavigate={onNavigate} />
    </>
  )
}
