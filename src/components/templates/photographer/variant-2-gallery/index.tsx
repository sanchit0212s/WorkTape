// Variant 2 — Gallery
// Swiss minimal / white cube. Tight Inter Tight, hairline rules, 12-col index
// grid with a wide-cover every 4th project. Server component + Reveal sub-component.
import { Inter_Tight } from 'next/font/google'
import type { ComponentType } from 'react'
import type { TemplateProps } from '../../types'
import { WorktapeBadge } from '../../worktape-badge'
import {
  bioText,
  heroHeadline,
  projectDescription,
  socialEntries,
  socialHref,
  socialLabel,
} from '../_shared/data'
import { Reveal } from './components/Reveal'

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-v2-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const GalleryTemplate: ComponentType<TemplateProps> = ({ data }) => {
  const { portfolio, projects } = data
  const bio = bioText(portfolio)
  const bullets = portfolio.bio_bullets ?? []
  const socials = socialEntries(portfolio.social_links)
  const since = (portfolio.published_at || portfolio.created_at || '2020').slice(0, 4)
  const year = new Date().getFullYear()

  return (
    <div
      className={`${sans.variable} min-h-screen bg-white text-[#0b0b0b]`}
      style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-7">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center pb-7 border-b border-[#eaeaea] text-[13px]">
          <div className="font-semibold tracking-[-0.01em] md:text-left text-center">{portfolio.display_name}</div>
          <div className="text-[#8a8a8a] text-center">{portfolio.tagline}</div>
          <div className="flex md:justify-end justify-center gap-5 text-[#8a8a8a]">
            {socials.slice(0, 4).map(([k, v]) => (
              <a key={k} href={socialHref(k, v)} target="_blank" rel="noopener noreferrer" className="hover:text-[#0b0b0b]">
                {socialLabel(k)}
              </a>
            ))}
          </div>
        </div>

        <section className="py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          <Reveal>
            <h1 className="m-0 font-medium leading-[0.96] tracking-[-0.03em] text-[44px] sm:text-[64px] md:text-[88px]">
              {heroHeadline(portfolio)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15px] text-[#8a8a8a] max-w-[32ch] leading-[1.5] m-0">
              {portfolio.tagline}. Selected works {since}—{year}.
            </p>
          </Reveal>
        </section>

        <div className="flex items-baseline gap-4 py-4 border-t border-[#0b0b0b] border-b border-b-[#eaeaea] uppercase tracking-[0.08em] text-[11px] md:text-[12px] text-[#8a8a8a]">
          <span className="text-[#0b0b0b] font-medium">Index</span>
          <span>Selected work</span>
          <span className="ml-auto tabular-nums">{String(projects.length).padStart(2, '0')} projects</span>
        </div>

        <main className="py-14 md:py-16 grid grid-cols-12 gap-y-10 md:gap-y-14 gap-x-5">
          {projects.map((pr, i) => {
            const wide = (i + 1) % 4 === 0 && projects.length > 2
            const d = projectDescription(pr)
            return (
              <Reveal key={pr.id} delay={(i % 3) * 0.05}>
                <article
                  className={`flex flex-col gap-3 ${wide ? 'col-span-12' : 'col-span-12 md:col-span-6'}`}
                >
                  <img
                    src={pr.images[0]?.url}
                    alt={pr.images[0]?.alt_text || pr.title || ''}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    className={`w-full block bg-[#f2f2f2] ${wide ? 'aspect-[2/1]' : 'aspect-[4/3]'} object-cover`}
                  />
                  <div className="flex justify-between items-baseline pt-1 text-[13px]">
                    <span className="font-medium tracking-[-0.01em]">{pr.title}</span>
                    <span className="text-[#8a8a8a] tabular-nums">
                      {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                    </span>
                  </div>
                  {d && <p className="text-[13px] text-[#8a8a8a] leading-[1.55] max-w-[48ch] m-0">{d}</p>}
                </article>
              </Reveal>
            )
          })}
        </main>

        {(bio || bullets.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 py-16 md:py-24 border-t border-[#0b0b0b]">
            <h3 className="m-0 mt-4 uppercase tracking-[0.08em] text-[12px] text-[#8a8a8a] font-medium">About</h3>
            <div>
              {bio && <p className="text-[17px] leading-[1.6] max-w-[60ch] m-0 mt-4">{bio}</p>}
              {bullets.length > 0 && (
                <ul className="list-none p-0 m-0 mt-6 flex flex-col gap-1.5 text-[14px]">
                  {bullets.map((b, i) => (
                    <li key={i} className="pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[#8a8a8a]">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        <footer className="border-t border-[#eaeaea] py-6 flex flex-wrap gap-4 justify-between items-center text-[12px] text-[#8a8a8a] tracking-[0.04em]">
          <div>© {portfolio.display_name}, {year}</div>
          <WorktapeBadge theme="light" />
        </footer>
      </div>
    </div>
  )
}

export default GalleryTemplate
