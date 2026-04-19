// Variant 3 — Brutalist
// Loud mono/display pairing, catalog-as-index row interaction, orange accent.
// Client component because the index row click opens the selected project below.
'use client'

import { Archivo_Black, JetBrains_Mono } from 'next/font/google'
import { useState } from 'react'
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

const display = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--font-v3-display', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-v3-mono', display: 'swap' })

const BrutalistTemplate: ComponentType<TemplateProps> = ({ data }) => {
  const { portfolio, projects } = data
  const bio = bioText(portfolio)
  const socials = socialEntries(portfolio.social_links)
  const [openIdx, setOpenIdx] = useState(0)

  const name = heroHeadline(portfolio)
  const parts = name.split(' ')
  const last = parts.pop() || ''
  const head = parts.join(' ')
  const open = projects[openIdx] ?? projects[0]

  return (
    <div
      className={`${display.variable} ${mono.variable} min-h-screen bg-[#f4f4ec] text-[#0a0a0a]`}
      style={{ fontFamily: 'var(--font-v3-mono), ui-monospace, monospace' }}
    >
      <header className="border-b-2 border-[#0a0a0a] py-3.5 px-6 grid grid-cols-[auto_1fr_auto] gap-6 items-center uppercase tracking-[0.06em] text-[12px]">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 bg-[#ff4b1f]" aria-hidden />
          Worktape / Photographer
        </div>
        <div className="text-[#666] text-center">{portfolio.slug ? `/${portfolio.slug}` : ''}</div>
        <nav className="flex gap-6 justify-end">
          {socials.slice(0, 4).map(([k, v]) => (
            <a
              key={k}
              href={socialHref(k, v)}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-transparent hover:border-[#0a0a0a]"
            >
              {socialLabel(k)}
            </a>
          ))}
        </nav>
      </header>

      <section className="px-6 pt-12 pb-6 border-b-2 border-[#0a0a0a]">
        <div className="flex gap-4 uppercase tracking-[0.12em] text-[11px] mb-6">
          <span>No. {String(projects.length).padStart(3, '0')}</span>
          <span>— Index of works, {new Date().getFullYear()}</span>
        </div>
        <h1
          className="m-0 font-black uppercase tracking-[-0.04em] leading-[0.82] break-words text-[64px] sm:text-[120px] md:text-[12vw] xl:text-[220px]"
          style={{ fontFamily: 'var(--font-v3-display), sans-serif' }}
        >
          {head}{head ? ' ' : ''}<span className="bg-[#ff4b1f] text-[#f4f4ec] px-[0.1em]">{last}</span>
        </h1>
        <p className="mt-7 text-[14px] max-w-[60ch] leading-[1.6]">{portfolio.tagline}.</p>
      </section>

      <section className="border-b-2 border-[#0a0a0a]">
        <div className="px-6 py-3.5 grid grid-cols-[36px_1fr_80px] md:grid-cols-[60px_1fr_1fr_80px_120px] gap-6 uppercase tracking-[0.08em] text-[11px] border-b border-[#0a0a0a]">
          <span>№</span>
          <span>Title</span>
          <span className="hidden md:block">Description</span>
          <span>Frames</span>
          <span className="hidden md:block">View</span>
        </div>
        <ul className="list-none m-0 p-0">
          {projects.map((pr, i) => {
            const d = projectDescription(pr) || '—'
            const isOpen = openIdx === i
            return (
              <li key={pr.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(i)}
                  className={`w-full text-left px-6 py-4 md:py-5 grid grid-cols-[36px_1fr_80px] md:grid-cols-[60px_1fr_1fr_80px_120px] gap-6 text-[13px] border-b border-[#0a0a0a] items-baseline cursor-pointer transition-colors focus:outline-none focus-visible:bg-[#ff4b1f] focus-visible:text-[#f4f4ec] ${isOpen ? 'bg-[#0a0a0a] text-[#f4f4ec]' : 'hover:bg-[#0a0a0a] hover:text-[#f4f4ec]'}`}
                >
                  <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span
                    className={`text-[18px] md:text-[20px] uppercase tracking-[-0.01em] ${isOpen ? 'text-[#ff4b1f]' : 'group-hover:text-[#ff4b1f]'}`}
                    style={{ fontFamily: 'var(--font-v3-display), sans-serif' }}
                  >
                    {pr.title}
                  </span>
                  <span className="hidden md:block opacity-80 truncate">{d}</span>
                  <span className="tabular-nums">{pr.images.length}</span>
                  <span className="hidden md:block">{isOpen ? '[OPEN]' : '[OPEN →]'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {open && (
        <section className="border-b-2 border-[#0a0a0a] px-6 py-10">
          <h3
            className="m-0 mb-6 uppercase text-[28px] md:text-[36px] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-v3-display), sans-serif' }}
          >
            {String(openIdx + 1).padStart(2, '0')} — {open.title}
          </h3>
          <div className="grid grid-cols-12 gap-4">
            {open.images.slice(0, 8).map((im, i) => (
              <img
                key={im.id}
                src={im.url}
                alt={im.alt_text || open.title || ''}
                loading={i === 0 && openIdx === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 && openIdx === 0 ? 'high' : undefined}
                className={`w-full block border-2 border-[#0a0a0a] bg-[#ddd] ${
                  i % 4 === 0 ? 'col-span-12 md:col-span-5'
                    : i % 4 === 1 ? 'col-span-12 md:col-span-7'
                    : i % 4 === 2 ? 'col-span-12 md:col-span-7'
                    : 'col-span-12 md:col-span-5'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {bio && (
        <section className="border-b-2 border-[#0a0a0a] px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
          <h3
            className="m-0 uppercase text-[28px] md:text-[36px] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-v3-display), sans-serif' }}
          >
            About.
          </h3>
          <p className="m-0 text-[15px] leading-[1.6] max-w-[62ch]">{bio}</p>
        </section>
      )}

      <footer className="px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <p
            className="m-0 uppercase leading-[0.85] tracking-[-0.04em] text-[48px] md:text-[96px] lg:text-[120px]"
            style={{ fontFamily: 'var(--font-v3-display), sans-serif' }}
          >
            Hire.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
            {socials.map(([k, v]) => (
              <a
                key={k}
                href={socialHref(k, v)}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[#0a0a0a] hover:text-[#ff4b1f] hover:border-[#ff4b1f]"
              >
                {socialLabel(k)} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="text-right uppercase tracking-[0.06em] text-[12px]">
          © {portfolio.display_name}
          <br />
          Set in Archivo Black &amp; JetBrains Mono
          <br />
          <span className="inline-block mt-3">
            <WorktapeBadge theme="light" />
          </span>
        </div>
      </footer>
    </div>
  )
}

export default BrutalistTemplate
