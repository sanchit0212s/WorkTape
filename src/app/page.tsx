import Link from 'next/link'
import {
  Camera,
  Palette,
  Layout,
  BookOpen,
  Box,
  Code2,
  ArrowRight,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react'

const GENRES = [
  { icon: Camera, label: 'Photographers' },
  { icon: Palette, label: 'Graphic Designers' },
  { icon: Layout, label: 'UI/UX Designers' },
  { icon: BookOpen, label: 'Writers' },
  { icon: Box, label: '3D Artists' },
  { icon: Code2, label: 'Developers' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">Worktape</span>
        <Link
          href="/auth/login"
          className="px-5 py-2 rounded-lg bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400 mb-8">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Portfolio in under 5 minutes
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          Your work deserves
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            a stunning portfolio.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 mt-6 max-w-2xl mx-auto">
          Pick a template. Fill a few fields. Upload your work. Get a
          beautiful, live portfolio website — no design skills needed.
        </p>

        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors"
          >
            Start Building
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Genres */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-center text-sm text-neutral-500 uppercase tracking-widest mb-8">
          Built for creatives
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {GENRES.map((genre) => (
            <div
              key={genre.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-neutral-800/50 bg-neutral-900/30"
            >
              <genre.icon className="w-6 h-6 text-neutral-400" />
              <span className="text-xs text-neutral-400">{genre.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-14">
          Three steps. That&apos;s it.
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pick a template</h3>
            <p className="text-sm text-neutral-400">
              Choose from stunning templates designed specifically for your
              creative discipline.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fill & upload</h3>
            <p className="text-sm text-neutral-400">
              Enter your name, upload your work. AI writes your bio and project
              descriptions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Publish</h3>
            <p className="text-sm text-neutral-400">
              Your portfolio goes live instantly. Share the link. Impress
              everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-lg mx-auto px-6 pb-24">
        <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
          <h2 className="text-2xl font-bold mb-2">Worktape Pro</h2>
          <div className="text-4xl font-bold mt-4">
            $10<span className="text-lg text-neutral-400 font-normal">/month</span>
          </div>
          <ul className="text-sm text-neutral-400 mt-6 space-y-2 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Beautiful portfolio website
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              All premium templates
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Up to 5 projects, unlimited images
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              AI-generated bio & descriptions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              worktape.com/yourname
            </li>
          </ul>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors mt-8"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm text-neutral-500">Worktape</span>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
