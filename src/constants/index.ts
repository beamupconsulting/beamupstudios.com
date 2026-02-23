/** Company & branding */
export const COMPANY_DISPLAY_NAME = 'BEAMUP STUDIOS'
export const COMPANY_LEGAL_NAME = 'BeamUp Consulting Inc.'

/** Contact */
export const EMAIL = 'hello@beamupstudios.com'
export const LEGAL_EMAIL = 'beamupconsultinginc@gmail.com'

/** Navigation */
export const NAV_CTA_LABEL = 'Get Started'
export const NAV_CTA_URL = 'https://calendar.app.google/9jUMDRdpNsUdYp3C8'

/** Routes */
export const ROUTE_HOME = '/'
export const ROUTE_PRIVACY = '/privacy'
export const ROUTE_TERMS = '/terms'

/** Footer copy */
export const FOOTER_LINK_HOME = 'Home'
export const FOOTER_LINK_PRIVACY = 'Privacy Policy'
export const FOOTER_LINK_TERMS = 'Terms of Service'

/** Legal page UI */
export const BACK_LABEL = 'Back'
export const PRIVACY_PAGE_TITLE = 'PRIVACY POLICY'
export const PRIVACY_LAST_UPDATED = 'Last Updated: January 1, 2026'
export const TERMS_PAGE_TITLE = 'TERMS OF SERVICE'
export const TERMS_EFFECTIVE_DATE = 'Effective Date: January 1, 2026'

/** Home page */
export const BIO_TEXT =
  "We're a technical engine building high-performance software and digital tools. We partner with startups and enterprises to engineer the scalable systems and internal products that bridge the gap from idea to launch. Let’s build the future together."

export const HERO_NAME_LINES = ['BEAMUP', 'STUDIOS'] as const

/** Feature flags (toggle in one place). URL override: ?bujo=1 or ?bujo=0 */
const BULLET_JOURNAL_DEFAULT = true
const bujoParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('bujo') : null
export const BULLET_JOURNAL_BACKGROUND =
  bujoParam === '0' || bujoParam === 'false' ? false : bujoParam === '1' || bujoParam === 'true' ? true : BULLET_JOURNAL_DEFAULT
