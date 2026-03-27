const CONFIG = {
  AURORA_BRAND_NAME: 'Wenhao Yang',
  AURORA_BRAND_ROLE: 'Assistant Professor & Researcher',
  AURORA_ORGANIZATION: 'Lamar University | Industrial & Systems Engineering',
  AURORA_TAGLINE:
    'Research in immersive learning, human-robot collaboration, and resilient industrial systems.',
  AURORA_CTA_PRIMARY_TEXT: 'Explore Research',
  AURORA_CTA_PRIMARY_LINK: '/research',
  AURORA_CTA_SECONDARY_TEXT: 'View Publications',
  AURORA_CTA_SECONDARY_LINK: '/publications',
  AURORA_CONTACT_EMAIL: 'wenhao.yang@university.edu',
  AURORA_CONTACT_LABEL: 'Contact',
  AURORA_HERO_CARD_TITLE: 'Recent Highlights',
  AURORA_HERO_CARD_ITEMS: JSON.stringify([
    'NSF IUSE proposal on XR learning submitted',
    'USDA-NIFA AFRI collaboration on precision robotics',
    'Spring 2026: AR/VR in Manufacturing (INEN-5301)'
  ]),
  AURORA_RESEARCH_TAGS: JSON.stringify([
    'AR/VR/XR',
    'Human-Robot Interaction',
    'Digital Twin',
    'Immersive Assessment'
  ]),
  AURORA_NAV_LINKS: JSON.stringify([
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Research', href: '/research' },
    { label: 'Lab', href: '/lab' },
    { label: 'People', href: '/people' },
    { label: 'Publications', href: '/publications' },
    { label: 'Contact', href: '/contact' }
  ]),
  AURORA_QUICK_LINKS: JSON.stringify([
    {
      title: 'About Me',
      desc: 'Bio, education, and research focus',
      href: '/about'
    },
    {
      title: 'Research',
      desc: 'Grants, areas, and project pages',
      href: '/research'
    },
    {
      title: 'Lab',
      desc: 'Facilities, demos, datasets',
      href: '/lab'
    },
    {
      title: 'People',
      desc: 'Students and collaborators',
      href: '/people'
    },
    {
      title: 'Publications',
      desc: 'Papers, preprints, media',
      href: '/publications'
    },
    {
      title: 'Links',
      desc: 'Scholar, ORCID, GitHub',
      href: '/links'
    }
  ]),
  AURORA_NEWS_ITEMS: JSON.stringify([
    {
      date: '2025-12-01',
      title: 'Paper accepted at IDETC‑CIE 2026',
      summary: 'XR-based learning assessment framework headed to the CIE track.',
      href: '/news/idetc-cie-2026'
    },
    {
      date: '2025-11-20',
      title: 'New collaboration with WTAMU',
      summary: 'Precision agriculture teleoperation study kicks off with WTAMU.',
      href: '/news/wtamu-collaboration'
    },
    {
      date: '2025-10-15',
      title: 'Spring 2026 Graduate Course announced',
      summary: 'INEN-5301 "AR/VR in Manufacturing" opens for enrollment.',
      href: '/courses/inen5301'
    }
  ]),
  AURORA_FOOTER_LINKS: JSON.stringify([
    { label: 'Google Scholar', href: 'https://scholar.google.com' },
    { label: 'ORCID', href: 'https://orcid.org' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Privacy', href: '/privacy' }
  ])
}

export default CONFIG
