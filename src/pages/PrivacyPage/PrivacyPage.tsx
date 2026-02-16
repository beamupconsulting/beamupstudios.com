import {
  BACK_LABEL,
  COMPANY_LEGAL_NAME,
  LEGAL_EMAIL,
  PRIVACY_LAST_UPDATED,
  PRIVACY_PAGE_TITLE,
} from '../../constants'
import { BackArrow } from '../../components/icons'
import { Footer } from '../../components/Footer/Footer'
import { LegalSection } from '../../components/LegalSection/LegalSection'
import '../LegalPage/LegalPage.css'

type PrivacyPageProps = {
  onNavigate: (path: string) => (e: React.MouseEvent) => void
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
        <div className="privacy__content">
          <LegalSection number={1} title="INTRODUCTION AND SCOPE">
            This Privacy Policy (the "Policy") describes how {COMPANY_LEGAL_NAME}, operating and also known as BeamUp Studios ("we," "us," "our," or the "Company"), collects, uses, and discloses information in the course of operating our website (beamupstudios.com), delivering freelance software engineering services, and providing web or mobile applications (collectively, the "Services").
            <p>By accessing our website, engaging us for consulting, or using any software built by us, you acknowledge that you have read and understood this Policy and agree to the collection and use of information as described herein. If you do not agree to these terms, you must immediately cease all use of our Services.</p>
          </LegalSection>
          <LegalSection number={2} title="BROAD SPECTRUM DATA COLLECTION">
            To provide the most robust de-risking possible, you acknowledge that the Company may collect, and you consent to the collection of, the following categories of data, whether collected explicitly or incidentally through standard server operations:
            <ul>
              <li><strong>Identity and Contact Data:</strong> Including but not limited to names, email addresses, phone numbers, and business identifiers.</li>
              <li><strong>Technical and Usage Data:</strong> Including IP addresses, browser types, device identifiers, time zones, operating systems, referral sources, length of visit, page views, and website navigation paths.</li>
              <li><strong>Log Data:</strong> Our servers automatically record information ("Log Data") which may include information such as your device's Internet Protocol ("IP") address, browser version, the pages of our Services that you visit, the time and date of your visit, and other statistics.</li>
              <li><strong>Interactions and Feedback:</strong> Any communications, support requests, or feedback provided directly to the Company.</li>
              <li><strong>Incidental Metadata:</strong> Any data points generated through the use of modern development frameworks, API calls, or third-party integrations that may be captured during the software development lifecycle.</li>
            </ul>
          </LegalSection>
          <LegalSection number={3} title="THIRD-PARTY INFRASTRUCTURE RELIANCE">
            The Company does not maintain its own physical data centers. We rely on third-party "Best-in-Class" infrastructure providers, including but not limited to Amazon Web Services (AWS), Vercel, Stripe, and GitHub.
            <ul>
              <li><strong>No Direct Management:</strong> You acknowledge that we do not have direct control over the physical security or internal data-handling protocols of these third-party providers.</li>
              <li><strong>Liability Waiver:</strong> The Company assumes zero liability for any data breach, leak, or corruption occurring at the infrastructure level. Your sole recourse for such events lies with the respective third-party provider.</li>
              <li><strong>International Transfers:</strong> Data may be transferred to, and maintained on, computers located outside of Ontario and Canada, where privacy laws may not be as protective. Your consent to this Policy represents your agreement to that transfer.</li>
            </ul>
          </LegalSection>
          <LegalSection number={4} title="PURPOSE OF DATA PROCESSING">
            We use the collected information for broad business purposes to ensure maximum operational flexibility:
            <ul>
              <li>To provide, maintain, and improve our software and consulting services.</li>
              <li>To process transactions and manage project milestones.</li>
              <li>To monitor and analyze usage patterns and technical trends.</li>
              <li>To detect, prevent, and address technical issues or security vulnerabilities.</li>
              <li>To comply with legal obligations under the laws of Ontario and the federal laws of Canada.</li>
            </ul>
          </LegalSection>
          <LegalSection number={5} title="DATA RETENTION AND DISPOSAL">
            The Company will retain your personal information only for as long as is necessary for the purposes set out in this Policy. We make no specific representations regarding the definitive timeline for data disposal. You acknowledge that "backups" or "cached versions" of data may persist in third-party systems or developer environments even after a deletion request has been processed.
          </LegalSection>
          <LegalSection number={6} title={'NO GUARANTEE OF SECURITY ("AS-IS" HANDLING)'}>
            While we implement standard security measures, you acknowledge that no method of transmission over the Internet, or method of electronic storage, is 100% secure.
            <p><strong>High-Risk Acknowledgment:</strong> You use our Services at your own risk. The Company does not warrant that its data handling is "fail-safe" or "unbreakable."</p>
            <p><strong>No Liability for Negligence:</strong> To the extent permitted by Ontario law, the Company is not liable for data exposure resulting from unintended software bugs, zero-day vulnerabilities, or administrative errors.</p>
          </LegalSection>
          <LegalSection number={7} title="YOUR RIGHTS UNDER PIPEDA">
            In accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to request access to the personal information we hold about you.
            <ul>
              <li><strong>Verification Requirement:</strong> To protect against unauthorized access, we will require rigorous proof of identity before processing any data request.</li>
              <li><strong>Limited Remedy:</strong> Your sole remedy for any dissatisfaction with our data practices is the deletion of your account and the cessation of use of our Services.</li>
            </ul>
          </LegalSection>
          <LegalSection number={8} title="INDEMNIFICATION BY CLIENTS">
            For consulting engagements, the Client warrants that they have the legal right to provide any data to {COMPANY_LEGAL_NAME} for the purpose of development. The Client shall indemnify, defend, and hold the Company harmless from any and all third-party claims, losses, or regulatory fines arising from the Client's data collection or the deployment of software built by the Company.
          </LegalSection>
          <LegalSection number={9} title="CHANGES TO THIS POLICY">
            We reserve the right to update or change our Privacy Policy at any time. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
          </LegalSection>
          <LegalSection number={10} title="CONTACT INFORMATION">
            For any legal inquiries regarding these terms, contact:
            <p className="privacy__contact">
              {COMPANY_LEGAL_NAME}<br />
              <a href={`mailto:${LEGAL_EMAIL}`} target="_blank">{LEGAL_EMAIL}</a>
            </p>
          </LegalSection>
        </div>
      </div>
      <Footer route="privacy" onNavigate={onNavigate} />
    </>
  )
}
