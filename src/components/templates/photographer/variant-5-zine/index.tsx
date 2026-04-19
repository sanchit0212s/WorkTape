// Variant 5 — Zine
// Warm, playful, paper-textured. Caveat (handwriting) + Fraunces (display serif)
// + Inter Tight (body). Tape, stamps, and a polaroid — professional collage.
import { Fraunces, Inter_Tight, Caveat } from 'next/font/google'
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

const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700', '900'],
  variable: '--font-v5-display',
  display: 'swap',
})
const sans = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-v5-sans', display: 'swap' })
const hand = Caveat({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-v5-hand', display: 'swap' })

// Card size rhythm — works for 1 or 15+.
const SIZES = [
  'col-span-12 md:col-span-8 md:-rotate-[0.4deg]',
  'col-span-12 md:col-span-4 -rotate-[0.6deg]',
  'col-span-12 md:col-span-6 rotate-[0.7deg]',
  'col-span-12 md:col-span-6 md:rotate-[0.3deg]',
  'col-span-12 md:col-span-4 -rotate-[0.5deg]',
  'col-span-12 md:col-span-8 rotate-[0.5deg]',
]

const ZineTemplate: ComponentType<TemplateProps> = ({ data }) => {
  const { portfolio, projects } = data
  const bio = bioText(portfolio)
  const bullets = portfolio.bio_bullets ?? []
  const socials = socialEntries(portfolio.social_links)
  const polaroid = projects[0]?.images[0]
  const headline = heroHeadline(portfolio)
  const words = headline.split(' ')

  const since = (portfolio.published_at || portfolio.created_at || '2020').slice(0, 4)

  return (
    <div
      className={`${display.variable} ${sans.variable} ${hand.variable} relative min-h-screen text-[#1a1410]`}
      style={{
        fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif',
        backgroundImage: [
          'radial-gradient(circle at 20% 10%, rgba(201,74,43,0.08), transparent 40%)',
          'radial-gradient(circle at 90% 60%, rgba(58,106,74,0.08), transparent 40%)',
        ].join(','),
        backgroundColor: '#fbf6ed',
      }}
    >
      <header className="px-6 md:px-8 pt-6 flex justify-between items-center">
        <span
          className="inline-block border-2 border-[#1a1410] rounded-full px-3.5 py-1.5 text-[20px] -rotate-[3deg]"
          style={{ fontFamily: 'var(--font-v5-hand), cursive' }}
        >
          {portfolio.display_name}
        </span>
        <nav className="flex gap-3.5 text-[13px]">
          {socials.slice(0, 4).map(([k, v]) => (
            <a
              key={k}
              href={socialHref(k, v)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-[3px] decoration-2 hover:text-[#c94a2b]"
            >
              {socialLabel(k)}
            </a>
          ))}
        </nav>
      </header>

      <section className="relative px-6 md:px-8 pt-10 pb-20">
        <span
          className="block text-[36px] md:text-[42px] text-[#c94a2b] -rotate-[2deg] mb-1"
          style={{ fontFamily: 'var(--font-v5-hand), cursive' }}
        >
          hello, I&apos;m
        </span>
        <h1
          className="m-0 font-black leading-[0.88] tracking-[-0.04em] text-[64px] sm:text-[100px] md:text-[10vw] xl:text-[180px] max-w-[14ch]"
          style={{ fontFamily: 'var(--font-v5-display), Georgia, serif' }}
        >
          {words.map((w, i) => {
            const isFirst = i === 0
            const isLast = i === words.length - 1 && words.length > 1
            return (
              <span key={i}>
                {isFirst ? (
                  <span className="inline-block bg-[#c94a2b] text-[#fbf6ed] px-[0.08em] -rotate-[1.5deg]">{w}</span>
                ) : isLast ? (
                  <em className="italic text-[#3a6a4a]">{w}</em>
                ) : (
                  w
                )}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            )
          })}
        </h1>
        <p className="mt-7 text-[18px] md:text-[20px] leading-[1.5] max-w-[32ch]">
          {portfolio.tagline}. Making pictures since {since}.
        </p>

        {polaroid && (
          <figure className="relative mx-auto md:absolute md:top-14 md:right-12 mt-8 md:mt-0 w-[260px] rotate-[4deg]">
            <span className="absolute -top-3.5 left-[30%] w-20 h-[22px] bg-yellow-200/60 -rotate-[6deg] border-l border-r border-dashed border-black/10" aria-hidden />
            <div className="bg-white pt-3 px-3 pb-9 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.25)]">
              <img src={polaroid.url} alt="" loading="eager" className="w-full block bg-gray-100" />
              <figcaption
                className="text-center mt-1.5 text-[18px]"
                style={{ fontFamily: 'var(--font-v5-hand), cursive' }}
              >
                from &ldquo;{projects[0].title}&rdquo;
              </figcaption>
            </div>
          </figure>
        )}
      </section>

      <div className="px-6 md:px-8 flex items-end gap-4 mt-8">
        <h2
          className="m-0 font-black leading-[0.9] tracking-[-0.02em] text-[40px] md:text-[56px] lg:text-[72px]"
          style={{ fontFamily: 'var(--font-v5-display), Georgia, serif' }}
        >
          Some things <em className="italic text-[#3a6a4a]">I made</em>.
        </h2>
        <span
          className="text-[24px] md:text-[26px] text-[#c94a2b] -rotate-[2deg] whitespace-nowrap"
          style={{ fontFamily: 'var(--font-v5-hand), cursive' }}
        >
          ↓ {projects.length} {projects.length === 1 ? 'thing' : 'things'}
        </span>
      </div>

      <main className="px-6 md:px-8 pt-10 pb-20 grid grid-cols-12 gap-6 md:gap-7">
        {projects.map((pr, i) => {
          const d = projectDescription(pr)
          return (
            <Reveal key={pr.id} className={SIZES[i % SIZES.length]}>
              <article className="bg-white p-3.5 pb-5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.25)] h-full">
                <img
                  src={pr.images[0]?.url}
                  alt={pr.images[0]?.alt_text || pr.title || ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  className="w-full block bg-gray-100 aspect-[4/3] object-cover"
                />
                <div className="flex justify-between items-baseline pt-2.5 text-[13px]">
                  <span className="text-[22px] font-bold tracking-[-0.01em]" style={{ fontFamily: 'var(--font-v5-display), Georgia, serif' }}>
                    {pr.title}
                  </span>
                  <span className="text-[18px] text-[#7a6a56]" style={{ fontFamily: 'var(--font-v5-hand), cursive' }}>
                    no. {i + 1}
                  </span>
                </div>
                {d && <p className="text-[13px] text-[#3c3329] leading-[1.5] mt-1.5 m-0">{d}</p>}
              </article>
            </Reveal>
          )
        })}
      </main>

      {bio && (
        <section className="px-6 md:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative bg-white p-8 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.3)] -rotate-[0.6deg]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-[22px] bg-yellow-200/60 -rotate-[3deg]" aria-hidden />
            <h3
              className="m-0 mb-3 text-[30px] md:text-[32px] text-[#c94a2b] -rotate-[1deg]"
              style={{ fontFamily: 'var(--font-v5-hand), cursive' }}
            >
              about me
            </h3>
            <p className="text-[16px] leading-[1.6] m-0">{bio}</p>
          </div>
          {bullets.length > 0 && (
            <div className="flex flex-col gap-3">
              {bullets.slice(0, 6).map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border-[1.5px] border-[#1a1410] rounded-full text-[14px] w-fit"
                >
                  <span aria-hidden>★</span>
                  <b className="font-semibold">{b}</b>
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="px-6 md:px-8 py-14 text-center border-t-[1.5px] border-dashed border-[#1a1410] mt-10">
        <div
          className="text-[#c94a2b] leading-none mb-6 text-[48px] md:text-[88px] lg:text-[110px]"
          style={{ fontFamily: 'var(--font-v5-hand), cursive' }}
        >
          say hi!
        </div>
        <div className="flex justify-center flex-wrap gap-4 text-[14px]">
          {socials.map(([k, v]) => (
            <a
              key={k}
              href={socialHref(k, v)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-[3px] hover:text-[#c94a2b]"
            >
              {socialLabel(k)} →
            </a>
          ))}
        </div>
        <div className="mt-7"><WorktapeBadge theme="light" /></div>
      </footer>
    </div>
  )
}

export default ZineTemplate
