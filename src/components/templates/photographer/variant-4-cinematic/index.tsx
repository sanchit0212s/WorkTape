// Variant 4 — Cinematic
// Dark, full-bleed hero with mix-blend-difference nav. Projects are horizontal
// tracks of tall images — a filmstrip metaphor. Fraunces italic display carries
// the drama; Inter Tight supports.
import { Fraunces, Inter_Tight } from 'next/font/google'
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
import { HorizontalTrack } from './components/HorizontalTrack'

const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-v4-display',
  display: 'swap',
})
const sans = Inter_Tight({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-v4-sans', display: 'swap' })

const CinematicTemplate: ComponentType<TemplateProps> = ({ data }) => {
  const { portfolio, projects } = data
  const bio = bioText(portfolio)
  const bullets = portfolio.bio_bullets ?? []
  const socials = socialEntries(portfolio.social_links)
  const hero = projects[0]?.images[0]

  const headline = heroHeadline(portfolio)
  const [firstWord, ...restWords] = headline.split(' ')
  const rest = restWords.join(' ')

  const since = (portfolio.published_at || portfolio.created_at || '2020').slice(0, 4)
  const year = new Date().getFullYear()
  const based = portfolio.tagline.split(',').pop()?.trim() || '—'
  const totalFrames = projects.reduce((s, p) => s + p.images.length, 0)

  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-screen bg-[#070707] text-[#f2efe7]`}
      style={{ fontFamily: 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <nav className="fixed top-0 left-0 right-0 z-20 px-6 md:px-8 py-6 flex justify-between items-center mix-blend-difference text-white text-[11px] uppercase tracking-[0.08em] pointer-events-none [&>*]:pointer-events-auto">
        <div>{portfolio.display_name}</div>
        <div className="flex gap-5">
          {socials.slice(0, 3).map(([k, v]) => (
            <a key={k} href={socialHref(k, v)} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100">
              {socialLabel(k)}
            </a>
          ))}
        </div>
      </nav>

      <header className="relative h-screen min-h-[720px] overflow-hidden">
        {hero && (
          <img
            src={hero.url}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070707]" aria-hidden />
        <div className="absolute inset-0 px-6 md:px-8 pb-20 flex flex-col justify-end z-[2]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#8c867c] mb-5">
            Photography — {since}–{year}
          </div>
          <h1
            className="m-0 font-light leading-[0.92] tracking-[-0.03em] max-w-[18ch] text-[56px] sm:text-[96px] md:text-[8.5vw] xl:text-[160px]"
            style={{ fontFamily: 'var(--font-v4-display), Georgia, serif' }}
          >
            <span className="italic">{firstWord}</span>
            {rest && <span className="font-extralight not-italic"> {rest}</span>}
          </h1>
          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 text-[13px] text-[#8c867c] tracking-[0.04em]">
            <div>
              <dt>Based</dt>
              <dd className="block text-[#f2efe7] font-medium text-[14px] mt-1 normal-case tracking-normal">{based}</dd>
            </div>
            <div>
              <dt>Projects</dt>
              <dd className="block text-[#f2efe7] font-medium text-[14px] mt-1 tabular-nums">{String(projects.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Frames</dt>
              <dd className="block text-[#f2efe7] font-medium text-[14px] mt-1 tabular-nums">{totalFrames}</dd>
            </div>
          </dl>
        </div>
        <div className="absolute right-6 md:right-8 bottom-10 text-[11px] uppercase tracking-[0.14em] text-[#8c867c] z-[3] [writing-mode:vertical-rl]">
          Scroll — Selected works
        </div>
      </header>

      <main>
        {projects.map((pr, i) => {
          const d = projectDescription(pr)
          return (
            <Reveal key={pr.id}>
              <section className="py-24 md:py-32 border-t border-[#1b1a18]">
                <header className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-6 md:gap-8 px-6 md:px-8 pb-10 items-baseline">
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#8c867c] tabular-nums">
                    Project {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </div>
                  <h2
                    className="m-0 font-light italic leading-none tracking-[-0.02em] text-[36px] md:text-[56px] lg:text-[72px]"
                    style={{ fontFamily: 'var(--font-v4-display), Georgia, serif' }}
                  >
                    {pr.title}
                  </h2>
                  {d && <p className="text-[#8c867c] text-[15px] leading-[1.55] max-w-[44ch] m-0">{d}</p>}
                </header>
                <HorizontalTrack images={pr.images} alt={pr.title} />
              </section>
            </Reveal>
          )
        })}
      </main>

      {bio && (
        <section className="py-28 md:py-36 px-6 md:px-8 grid grid-cols-1 md:grid-cols-[0.6fr_1fr_0.4fr] gap-10 md:gap-20 border-t border-[#1b1a18] items-start">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#8c867c]">About</div>
          <p
            className="m-0 font-light italic text-[22px] md:text-[26px] leading-[1.4] max-w-[30ch]"
            style={{ fontFamily: 'var(--font-v4-display), Georgia, serif' }}
          >
            {bio}
          </p>
          {bullets.length > 0 && (
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5 text-[13px]">
              {bullets.map((b, i) => (
                <li key={i} className="pt-2.5 border-t border-[#1b1a18]">{b}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className="px-6 md:px-8 py-8 flex flex-wrap gap-4 justify-between items-center border-t border-[#1b1a18] text-[12px] uppercase tracking-[0.08em] text-[#8c867c]">
        <div>© {portfolio.display_name}</div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socials.map(([k, v]) => (
            <a
              key={k}
              href={socialHref(k, v)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f2efe7]"
            >
              {socialLabel(k)}
            </a>
          ))}
          <span className="ml-2"><WorktapeBadge /></span>
        </div>
      </footer>
    </div>
  )
}

export default CinematicTemplate
