// Variant 1 — Editorial
// Serif-forward, magazine-inspired. Asymmetric 12-col photo essays, drop-cap bio,
// small-caps metadata. Server component with a client sub-component only for
// scroll reveals.
import { Source_Serif_4, Inter_Tight } from 'next/font/google'
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

const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-v1-serif',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
  display: 'swap',
})
const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-v1-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
})

// Asymmetric grid patterns — cycled by image index for rhythm.
const GRID_PATTERNS: Record<string, string[]> = {
  short: ['col-span-12 md:col-span-8', 'col-span-12 md:col-span-4'],
  medium: [
    'col-span-12 md:col-span-6', 'col-span-12 md:col-span-6',
    'col-span-12 md:col-span-8', 'col-span-12 md:col-span-4',
  ],
  long: [
    'col-span-12 md:col-span-8', 'col-span-12 md:col-span-4',
    'col-span-12 md:col-span-6', 'col-span-12 md:col-span-6',
    'col-span-12 md:col-span-4', 'col-span-12 md:col-span-8',
  ],
}
const gridClass = (i: number, total: number) => {
  const p = total <= 2 ? GRID_PATTERNS.short : total <= 4 ? GRID_PATTERNS.medium : GRID_PATTERNS.long
  return p[i % p.length]
}

const EditorialTemplate: ComponentType<TemplateProps> = ({ data }) => {
  const { portfolio, projects } = data
  const bio = bioText(portfolio)
  const socials = socialEntries(portfolio.social_links)
  const since = (portfolio.published_at || portfolio.created_at || '').slice(0, 4) || '—'

  return (
    <div
      className={`${serif.variable} ${sans.variable} min-h-screen bg-[#f6f3ec] text-[#14110d]`}
      style={{ fontFamily: 'var(--font-v1-serif), Georgia, serif' }}
    >
      <nav
        className="flex justify-between items-baseline px-6 md:px-10 pt-7 uppercase tracking-[0.06em] text-[11px] text-[#6b6558]"
        style={{ fontFamily: 'var(--font-v1-sans), sans-serif' }}
      >
        <span className="text-[#14110d] font-semibold">{portfolio.display_name}</span>
        <div className="flex gap-6">
          <a href="#work" className="hover:text-[#14110d]">Work</a>
          {bio && <a href="#about" className="hover:text-[#14110d]">About</a>}
          <a href="#contact" className="hover:text-[#14110d]">Contact</a>
        </div>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 px-6 md:px-10 pt-20 pb-14 border-b border-[#d9d2c0] items-end">
        <div>
          <div
            className="uppercase tracking-[0.14em] text-[11px] text-[#6b6558] mb-7"
            style={{ fontFamily: 'var(--font-v1-sans), sans-serif' }}
          >
            Photographer — Folio {new Date().getFullYear()}
          </div>
          <h1 className="m-0 leading-[0.92] tracking-[-0.02em] font-normal italic text-[54px] sm:text-[88px] lg:text-[7vw] xl:text-[128px]">
            {heroHeadline(portfolio)}
            <span className="not-italic">.</span>
          </h1>
        </div>
        <div>
          <p className="text-[21px] leading-[1.45] max-w-[46ch] m-0">{portfolio.tagline}</p>
          <dl
            className="mt-8 grid grid-cols-2 gap-4 uppercase tracking-[0.04em] text-[11px] text-[#6b6558]"
            style={{ fontFamily: 'var(--font-v1-sans), sans-serif' }}
          >
            <div>
              <dt>Projects</dt>
              <dd
                className="block text-[#14110d] font-semibold mt-1 normal-case tracking-normal text-[14px]"
                style={{ fontFamily: 'var(--font-v1-serif), serif' }}
              >
                {projects.length}
              </dd>
            </div>
            <div>
              <dt>Since</dt>
              <dd
                className="block text-[#14110d] font-semibold mt-1 normal-case tracking-normal text-[14px]"
                style={{ fontFamily: 'var(--font-v1-serif), serif' }}
              >
                {since}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {bio && (
        <section id="about" className="px-6 md:px-10 pt-14 max-w-5xl mx-auto">
          <Reveal>
            <p
              className="text-[18px] md:text-[20px] leading-[1.55] md:columns-2 md:gap-10 text-[#2a251e] indent-[2em] [&::first-letter]:text-[4em] [&::first-letter]:leading-[0.85] [&::first-letter]:float-left [&::first-letter]:mr-2.5 [&::first-letter]:mt-1 [&::first-letter]:font-medium"
            >
              {bio}
            </p>
          </Reveal>
        </section>
      )}

      <main id="work" className="flex flex-col gap-24 md:gap-32 px-6 md:px-10 py-20">
        {projects.map((pr, pi) => {
          const d = projectDescription(pr)
          return (
            <Reveal key={pr.id}>
              <article>
                <header className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-baseline border-b border-[#d9d2c0] pb-5 mb-8">
                  <span
                    className="uppercase tracking-[0.14em] text-[11px] text-[#6b6558]"
                    style={{ fontFamily: 'var(--font-v1-sans), sans-serif' }}
                  >
                    № {String(pi + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-[28px] md:text-[40px] leading-none font-normal italic m-0">{pr.title}</h2>
                  {d && (
                    <p
                      className="text-[13px] text-[#6b6558] max-w-[36ch] md:text-right col-span-2 md:col-auto"
                      style={{ fontFamily: 'var(--font-v1-sans), sans-serif' }}
                    >
                      {d}
                    </p>
                  )}
                </header>
                <div className="grid grid-cols-12 gap-3 md:gap-5">
                  {pr.images.map((im, ii) => (
                    <img
                      key={im.id}
                      src={im.url}
                      alt={im.alt_text || pr.title || ''}
                      loading={pi === 0 && ii === 0 ? 'eager' : 'lazy'}
                      fetchPriority={pi === 0 && ii === 0 ? 'high' : undefined}
                      className={`${gridClass(ii, pr.images.length)} w-full h-auto block bg-[#ecdac8]`}
                    />
                  ))}
                </div>
              </article>
            </Reveal>
          )
        })}
      </main>

      <footer
        id="contact"
        className="border-t border-[#d9d2c0] px-6 md:px-10 py-10 flex flex-wrap gap-6 justify-between items-center uppercase tracking-[0.06em] text-[11px] text-[#6b6558]"
        style={{ fontFamily: 'var(--font-v1-sans), sans-serif' }}
      >
        <div>© {portfolio.display_name} — All rights reserved</div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {socials.map(([k, v]) => (
            <a key={k} href={socialHref(k, v)} className="hover:text-[#14110d]" target="_blank" rel="noopener noreferrer">
              {socialLabel(k)}
            </a>
          ))}
          <WorktapeBadge theme="light" />
        </div>
      </footer>
    </div>
  )
}

export default EditorialTemplate
