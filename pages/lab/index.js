// /pages/lab/index.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { isBrowser } from '@/lib/utils'
import { useEffect } from 'react'

export default function LabPage (props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)

  // Smooth-scroll to hash anchors, e.g., /lab#equipment
  useEffect(() => {
    if (!isBrowser) return
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const target = document.getElementById(hash.replace('#', ''))
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [])

  // ——— Equipment data (replace images with your real URLs later) ———
  const equipments = [
    {
      name: 'UR10e (Collaborative Robot)',
      img: 'https://picsum.photos/seed/ur10e/640/360',
      desc: '10 kg payload and 1300 mm reach. Great for assembly, material handling, and HRC education/research.'
    },
    {
      name: 'xArm 6 (Collaborative Robot Arm)',
      img: 'https://picsum.photos/seed/xarm6/640/360',
      desc: 'Lightweight 6-DoF arm with high repeatability—ideal for Programming by Demonstration (PbD) and HRI experiments.'
    },
    {
      name: 'Virtualis Motion VR System',
      img: 'https://picsum.photos/seed/virtualis/640/360',
      desc: 'Immersive platform for motion/rehabilitation training and assessment with posture and interaction tracking.'
    },
    {
      name: 'HTC Vive Pro 2',
      img: 'https://picsum.photos/seed/vivepro2/640/360',
      desc: 'High‑resolution PCVR headset for high‑fidelity industrial simulation and accurate spatial calibration.'
    },
    {
      name: 'Meta Quest 3',
      img: 'https://picsum.photos/seed/quest3/640/360',
      desc: 'Mainstream standalone MR/VR headset with passthrough for mixed reality—ideal for rapid prototyping and user studies.'
    },
    {
      name: 'Meta Quest 3s',
      img: 'https://picsum.photos/seed/quest3s/640/360',
      desc: 'Lightweight standalone MR/VR device—portable for classroom demos and quick experiences.'
    }
  ]

  // ——— Ongoing projects (placeholder content; update as needed) ———
  const projects = [
    {
      title: 'AR Guidance & Precise Visualization for Human‑Robot Collaboration',
      brief: 'AR overlays for task guidance and state feedback to improve safety, accuracy, and efficiency in HRC.'
    },
    {
      title: 'Rapid Deployment of Cobots via Programming by Demonstration (PbD)',
      brief: 'Combining hand‑guiding with AR feedback to lower the barrier for robot task modeling and deployment.'
    },
    {
      title: 'MR Teleoperation & Digital Twin',
      brief: 'Remote monitoring and control for a mobile base + manipulator through mixed reality and synchronized digital twins.'
    }
  ]

  return (
    // Keep it minimal and theme-agnostic (no layoutName), just like your /lab setup before
    <div className='max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10'>
      {/* Header with quick in-page anchors */}
      <header className='mb-8'>
        <h1 className='text-3xl font-bold'>Extended Reality and Robotics (XR²) Lab</h1>
        <p className='mt-3 text-gray-600 dark:text-gray-300'>
          We integrate AR/VR/MR with robotics for human‑robot collaboration, resilient industrial systems,
          teleoperation, training, and assessment.
        </p>

        <nav className='flex flex-wrap gap-3 mt-4 text-sm'>
          #about
            About
          </a>
          #projects
            Ongoing Projects
          </a>
          #equipment
            Equipment
          </a>
        </nav>
      </header>

      {/* About */}
      <section id='about' className='my-10'>
        <h2 className='text-2xl font-semibold mb-3'>About the Lab</h2>
        <div className='prose dark:prose-invert max-w-none'>
          <p>
            The XR² Lab focuses on the deep integration of extended reality (XR—AR/VR/MR) and robotics.
            Our research spans <strong>human‑robot collaboration (HRC/HRI)</strong>, <strong>Programming by Demonstration (PbD)</strong>,
            <strong> resilient industrial systems</strong>, <strong>MR teleoperation</strong>, and
            <strong> training and assessment</strong>. We support the full pipeline from rapid prototyping and user studies
            to mixed‑reality validation and real‑world trials.
          </p>
        </div>
      </section>

      {/* Ongoing Projects */}
      <section id='projects' className='my-10'>
        <h2 className='text-2xl font-semibold mb-3'>Ongoing Projects</h2>
        <div className='grid md:grid-cols-2 gap-4'>
          {projects.map((p, i) => (
            <div key={i} className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
              <h3 className='font-semibold'>{p.title}</h3>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{p.brief}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipment Cards */}
      <section id='equipment' className='my-10'>
        <h2 className='text-2xl font-semibold mb-3'>Equipment</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
          Each device is shown as an independent card with an image and a short description.
          You can replace the placeholder image URLs with your real images stored in <code>/public</code> or any CDN/object storage.
        </p>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {equipments.map((eq, idx) => (
            <article key={idx} className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900'>
              <div className='aspect-video bg-gray-100 dark:bg-gray-800'>
                <img
                  src={eq.img}
                  alt={eq.name}
                  className='w-full h-full object-cover'
                  loading='lazy'
                />
              </div>
              <div className='p-4'>
                <h3 className='font-semibold'>{eq.name}</h3>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{eq.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tiny footer info */}
      <footer className='text-center text-sm text-gray-500 dark:text-gray-400 mt-12'>
        theme: {String(theme)}
      </footer>
    </div>
  )
}

export async function getStaticProps ({ locale }) {
  try {
    const props = await getGlobalData({ from: 'lab', locale })
    return {
      props,
      revalidate: 60 // short ISR window for quick refresh online
    }
  } catch (e) {
    return {
      props: { __error: 'lab-build-failed', message: String(e) },
      revalidate: 60
    }
  }
}
