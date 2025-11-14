// /pages/profile.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isBrowser } from '@/lib/utils'
import { DynamicLayout } from '@/themes/theme'
import { useEffect } from 'react'

const ProfilePage = (props) => {
  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash
      if (anchor) {
        setTimeout(() => {
          const el = document.getElementById(anchor.substring(1))
          if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }, 300)
      }
    }
  }, [])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  const data = getProfileData()

  return (
    // 如果你的主题需要特定 layoutName，再加上：layoutName='LayoutArchive' 或 'LayoutPage'
    <DynamicLayout theme={theme} {...props}>
      <main className='max-w-4xl mx-auto px-4 md:px-6 lg:px-8 my-8'>
        <header className='my-6'>
          <h1 className='text-3xl font-bold'>
            Dr. Wenhao Yang
            <span className='ml-2 text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-700'>XR² Lab</span>
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
            Assistant Professor · Industrial &amp; Systems Engineering (ISE), Lamar University
          </p>
          <nav className='flex flex-wrap gap-3 mt-4 text-sm'>
            <a href="#about" className='hover:underline'>About</a>
            <a href="#research" className='hover:underline'>Research</a>
            <a href="#education" className='hover:underline'>Education</a>
            <a href="#work" className='hover:underline'>Work</a>
            <a href="#service" className='hover:underline'>Service</a>
          </nav>
        </header>

        {/* About */}
        <section id='about' className='my-10'>
          <h2 className='text-2xl font-semibold mb-4'>About Me</h2>
          <div className='prose dark:prose-invert max-w-none'>
            {data.about.map((p, i) => (<p key={i}>{p}</p>))}
          </div>
        </section>

        {/* Research Interests */}
        <section id='research' className='my-10'>
          <h2 className='text-2xl font-semibold mb-4'>Research Interests</h2>
          <div className='flex flex-wrap gap-2'>
            {data.interests.map((tag, i) => (
              <span key={i}
                className='text-sm px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'>
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id='education' className='my-10'>
          <h2 className='text-2xl font-semibold mb-4'>Education</h2>
          <div className='flex flex-col gap-4'>
            {data.education.map((e, i) => (<EduCard key={i} item={e} />))}
          </div>
        </section>

        {/* Work Experience */}
        <section id='work' className='my-10'>
          <h2 className='text-2xl font-semibold mb-4'>Work Experience</h2>
          <div className='flex flex-col gap-4'>
            {data.experience.map((x, i) => (<ExpCard key={i} item={x} />))}
          </div>
        </section>

        {/* Professional Service */}
        <section id='service' className='my-10'>
          <h2 className='text-2xl font-semibold mb-4'>Professional Service</h2>
          <div className='space-y-6'>
            <ServiceBlock title='Reviewer of Journals' items={data.service.journals} />
            <ServiceBlock title='Reviewer of Peer-reviewed Conferences' items={data.service.conferences} />
            <ServiceBlock title='Technical Committee' items={data.service.committees} />
          </div>
        </section>

        <footer className='text-center text-sm text-gray-500 dark:text-gray-400 my-10'>
          © {new Date().getFullYear()} Wenhao Yang · Built on {theme}
        </footer>
      </main>
    </DynamicLayout>
  )
}

function EduCard ({ item }) {
  return (
    <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
      <div className='flex items-start gap-4'>
        <div className='w-14 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg'>
          🎓
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-lg'>
            {item.degree}{' '}
            <span className='ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
              {item.period}
            </span>
          </h3>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            <a href={item.schoolUrl} target='_blank' rel='noreferrer' className='hover:underline'>
              {item.school}
            </a> · {item.location}
          </div>
          {item.program && <div className='text-sm mt-1'>{item.program}</div>}
          {item.supervisor && (
            <div className='text-sm mt-1'>
              Supervisor:{' '}
              <a href={item.supervisor.url} target='_blank' rel='noreferrer' className='hover:underline'>
                {item.supervisor.name}
              </a>
            </div>
          )}
          {item.dissertation && (
            <div className='text-sm mt-1'>
              Dissertation:{' '}
              <a href={item.dissertation.url} target='_blank' rel='noreferrer' className='hover:underline'>
                <em>{item.dissertation.title}</em>
              </a>
            </div>
          )}
          {item.advisor && <div className='text-sm mt-1'>Advisor: {item.advisor}</div>}
          {item.thesis && <div className='text-sm mt-1'>Thesis: <em>{item.thesis}</em></div>}
        </div>
      </div>
    </div>
  )
}

function ExpCard ({ item }) {
  return (
    <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
      <h3 className='font-semibold text-lg'>
        {item.title}{' '}
        <span className='ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          {item.period}
        </span>
      </h3>
      <div className='text-sm text-gray-600 dark:text-gray-400'>
        {item.org} · {item.location}
      </div>
      <ul className='list-disc pl-5 mt-2 space-y-1'>
        {item.bullets.map((b, i) => (<li key={i}>{b}</li>))}
      </ul>
    </div>
  )
}

function ServiceBlock ({ title, items }) {
  return (
    <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
      <h3 className='font-semibold'>{title}</h3>
      <ul className='list-disc pl-5 mt-2 space-y-1'>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  )
}

/** 纯前端数据，可替换为 props.profile */
function getProfileData () {
  return {
    about: [
      'Dr. Yang is an Assistant Professor in the Department of Industrial and Systems Engineering (ISE) at Lamar University, where he joined in Fall 2024. His research focuses on cutting-edge technologies in Augmented Reality (AR), Virtual Reality (VR), and Mixed Reality (MR), with applications in Human-Robot Interaction (HRI), industrial systems, resilience engineering, and training environments.',
      'He earned his Ph.D. in Industrial and Systems Engineering from the Rochester Institute of Technology (RIT) in 2023. His research interests span advanced manufacturing, human-computer interaction (HCI), and solving complex challenges in industrial systems. Dr. Yang has developed and taught various Industrial Engineering courses, including Collaborative Robot Operation and Programming, AR/VR Applications, Introduction to Robotics, and Robotics and Automation in Manufacturing.',
      'Dr. Yang welcomes inquiries from motivated students interested in joining his eXtended Reality and Robotics (XR²) Lab to explore innovative solutions at the intersection of robotics, AR/VR, and industrial applications.'
    ],
    interests: [
      'Human-robot Interaction', 'Robotics manipulation', 'Programming by Demonstration', 'Robotics System Design',
      'Augmented & Virtual Reality', 'Human Factors', 'Tele-robots', 'Cobots', 'AGVs', 'Mobile Manipulators',
      'Cyber-Physical Systems', 'Digital Twin', 'Industry 4.0', 'Smart Factory'
    ],
    education: [
      {
        degree: 'Ph.D.',
        period: '2019 – 2023',
        school: 'Rochester Institute of Technology',
        schoolUrl: 'https://www.rit.edu/',
        location: 'USA',
        program: 'Engineering Ph.D. Program',
        supervisor: { name: 'Dr. Yunbo Zhang', url: 'https://www.willyunbozhang.com/' },
        dissertation: {
          title: 'Enhancing human-robot collaboration through intuitive Augmented Reality interface and precise visualization',
          url: 'https://www.proquest.com/docview/2908918372?Theses&fromopenview=true&pq-origsite=gscholar&sourcetype=Dissertations'
        }
      },
      {
        degree: 'M.S.',
        period: '2018 – 2019',
        school: 'The Hong Kong University of Science and Technology',
        schoolUrl: 'https://hkust.edu.hk/',
        location: 'Hong Kong, China',
        program: 'Mechanical Engineering | GPA 4.0/4.0',
        advisor: 'Prof. Kai Tang',
        thesis: 'Robotic engraving of complex models'
      },
      {
        degree: 'B.S.',
        period: '2014 – 2018',
        school: 'Nanjing University of Aeronautics and Astronautics',
        schoolUrl: 'https://nuaa.edu.cn/',
        location: 'P. R. China',
        program: 'Aircraft Design and Engineering | GPA 3.9/5.0 Rank 35/302',
        thesis: 'Structure design of micro multi-legged robot based on piezoelectric actuators'
      }
    ],
    experience: [
      {
        title: 'Assistant Professor',
        org: 'Lamar University',
        location: 'Beaumont, TX 77705, USA',
        period: 'Jul. 2024 – Present',
        bullets: [
          'Research Interests: Human-robot Interaction, Robotics manipulation, Programming by Demonstration, Robotics System Design, Augmented & Virtual Reality, Human Factors, Tele-robots, Cobots, Cyber-Physical Systems, Digital Twin, Industry 4.0, Smart Factory.',
          'Teaching: Robotics Operations and Programming (INEN-5301), AR/VR in manufacturing (INEN-5301), Introduction to Robotics (INEN-5358), Professional Seminar (INEN-6110).'
        ]
      },
      {
        title: 'Software Engineer',
        org: 'Meta Reality Labs',
        location: 'Redmond, WA 98052, USA',
        period: 'Jan. 2024 – Mar. 2024',
        bullets: [
          'Enhanced Meta Simulators’ wide-FOV compatibility; validated canting camera on UEVR & SteamVR; tested 30 apps for stability/performance.',
          'Developed & optimized VRSDKs for 4+ prototype HMDs (wide-FOV, varifocal, high-res), reducing integration time by 30%.',
          'Built two immersive UE scenarios to showcase wide-FOV applications; achieved 20% higher user engagement in usability tests.',
          'Designed a realistic Codec Avatar experience via Unity (multi-avatar PCVR).'
        ]
      },
      {
        title: 'Guest Lecturer',
        org: 'Monroe Community College',
        location: 'Rochester, NY 14623, USA',
        period: 'Aug. 2023 – May. 2024',
        bullets: [
          'Developed course “Industrial Robotics and Automation in Manufacturing” covering Industry 4.0 challenges & opportunities.',
          'Delivered in-person and online.'
        ]
      },
      {
        title: 'Research Assistant',
        org: 'Rochester Institute of Technology',
        location: 'Rochester, NY 14623, USA',
        period: 'Aug. 2019 – Aug. 2023',
        bullets: [
          'Set up lab with robot manipulators (Aubo, UFactory) and VR HMDs (Oculus Rift, HTC Vive, Meta Quest 1/2/3/Pro).',
          'Conducted research in human-robot interaction, smart manufacturing, and AR/VR development.',
          'Supported various research projects with Dr. Yunbo Zhang.'
        ]
      },
      {
        title: 'Research Intern',
        org: 'OPPO US Research Center (Innopeak Tech)',
        location: 'Bellevue, WA 98004, USA',
        period: 'Jun. 2022 – Sep. 2022',
        bullets: [
          'Designed and developed an MR teleoperation system with an AGV (Rover Pro).',
          'Implemented on Microsoft HoloLens 2 with real-time video streaming.',
          'Created 3D UI/UX for intuitive control (three modes).',
          'Built a Metaverse fitness instruction demo.'
        ]
      },
      {
        title: 'Teaching Assistant',
        org: 'Rochester Institute of Technology',
        location: 'Rochester, NY 14623, USA',
        period: 'Aug. 2021 – May. 2022',
        bullets: [
          '3D Printing (ISEE-741): hands-on labs with Original Prusa, Markforged, Formlabs.',
          'Materials Processing (ISEE-140): guided fabrication processes (cutting, molding, casting, forming, milling, powder metallurgy, solid modeling, drawing).'
        ]
      },
      {
        title: 'Engineering Intern',
        org: 'Guangdong Bright Dream Robotics Co., Ltd.',
        location: 'Foshan, Guangdong, China',
        period: 'May. 2019 – Aug. 2019',
        bullets: [
          'Tile-Laying Robot: developed elevation positioning & motion control for autonomous movement.',
          'Developed & tested 6-DOF robot software for smooth motion and performance.'
        ]
      }
    ],
    service: {
      journals: [
        'ASME Journal of Computing and Information Science in Engineering (JCISE)',
        'Journal of Intelligent Manufacturing',
        'Journal of Robotics and Computer-Integrated Manufacturing'
      ],
      conferences: [
        'American Society for Engineering Education (ASEE) Annual Conference | 2025',
        'IEEE Conference on Robot and Human Interactive Communication (RO-MAN) | 2024',
        'ACM International Conference of Human-Computer Interaction (CHI) | 2024',
        'ASME Manufacturing Science and Engineering Conference (MSEC) | 2023 – 2024',
        'ASME International Design Engineering Technical Conferences & Computers and Information in Engineering Conference (IDETC-CIE) | 2023 – 2025'
      ],
      committees: [
        'ASME CIE — Virtual Environments Systems (VES) | 2024 – 2025'
      ]
    }
  }
}

export async function getStaticProps ({ locale }) {
  const props = await getGlobalData({ from: 'profile', locale })
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}

export default ProfilePage
