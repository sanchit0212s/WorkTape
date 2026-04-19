'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Genre } from '@/types/database'
import {
  Camera,
  Palette,
  Layout,
  BookOpen,
  Box,
  Code2,
} from 'lucide-react'

const GENRES: { value: Genre; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'photographer',
    label: 'Photographer',
    description: 'Full-bleed images, masonry grids, lightbox galleries',
    icon: Camera,
  },
  {
    value: 'graphic-designer',
    label: 'Graphic Designer',
    description: 'Bold layouts, large project cards, vibrant palettes',
    icon: Palette,
  },
  {
    value: 'ui-ux-designer',
    label: 'UI/UX Designer',
    description: 'Clean case-study layouts, process documentation',
    icon: Layout,
  },
  {
    value: 'writer',
    label: 'Writer / Journalist',
    description: 'Typography-first, reading-focused, publication lists',
    icon: BookOpen,
  },
  {
    value: '3d-artist',
    label: '3D Artist / Animator',
    description: 'Dark cinematic backgrounds, embed support',
    icon: Box,
  },
  {
    value: 'developer',
    label: 'Developer / Engineer',
    description: 'Terminal aesthetic, project cards, tech stack badges',
    icon: Code2,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue() {
    if (!selectedGenre) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated. Please sign in again.')
      setLoading(false)
      return
    }

    // Create portfolio with selected genre
    const { error: insertError } = await supabase.from('portfolios').insert({
      user_id: user.id,
      genre: selectedGenre,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        // Portfolio already exists — redirect to profile
        router.push('/dashboard/onboarding/profile')
        return
      }
      setError('Failed to create portfolio. Please try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard/onboarding/profile')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">What do you create?</h1>
        <p className="text-neutral-400 mt-2">
          Pick your creative discipline. This determines your template style.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {GENRES.map((genre) => {
          const Icon = genre.icon
          const isSelected = selectedGenre === genre.value
          return (
            <button
              key={genre.value}
              onClick={() => setSelectedGenre(genre.value)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'border-white bg-white/5'
                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isSelected ? 'text-white' : 'text-neutral-500'
                  }`}
                />
                <div>
                  <h3
                    className={`font-medium ${
                      isSelected ? 'text-white' : 'text-neutral-300'
                    }`}
                  >
                    {genre.label}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {genre.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedGenre || loading}
          className="px-8 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
