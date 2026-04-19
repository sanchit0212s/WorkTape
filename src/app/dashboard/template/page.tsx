'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Loader2, Check } from 'lucide-react'
import {
  photographerVariants,
  DEFAULT_PHOTOGRAPHER_VARIANT,
  type VariantMeta,
} from '@/components/templates/registry'
import type { Portfolio, Genre } from '@/types/database'

// Map genre → variant catalog. Add an entry per genre as it comes online.
// Keeping this here (instead of in the registry) avoids shipping all template
// bundles into the client picker route.
const VARIANTS_BY_GENRE: Partial<Record<Genre, readonly VariantMeta[]>> = {
  photographer: photographerVariants,
}

const DEFAULT_BY_GENRE: Partial<Record<Genre, string>> = {
  photographer: DEFAULT_PHOTOGRAPHER_VARIANT,
}

export default function TemplatePickerPage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data: pf } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!pf) {
      router.push('/dashboard/onboarding')
      return
    }

    setPortfolio(pf as Portfolio)
    setLoading(false)
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  async function selectVariant(slug: string) {
    if (!portfolio || saving) return
    setSaving(slug)
    setSaveError(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('portfolios')
      .update({ template_variant: slug })
      .eq('id', portfolio.id)

    if (error) {
      // Most common cause: the 002_template_variant.sql migration hasn't been
      // run on the Supabase project yet, so the column doesn't exist. Surface
      // it instead of swallowing so the user knows what to do.
      setSaveError(
        error.message.includes('template_variant')
          ? 'The template_variant column is missing on your Supabase portfolios table. Run supabase/migrations/002_template_variant.sql against your database, then try again.'
          : `Couldn't save selection: ${error.message}`,
      )
      setSaving(null)
      return
    }

    setPortfolio({ ...portfolio, template_variant: slug })
    setSaving(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    )
  }
  if (!portfolio) return null

  const variants = VARIANTS_BY_GENRE[portfolio.genre]
  const currentSlug =
    portfolio.template_variant || DEFAULT_BY_GENRE[portfolio.genre] || null

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Template</h1>
      <p className="text-neutral-400 mb-8">
        Pick the design that best fits your work. You can change it any time.
      </p>

      {saveError && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {saveError}
        </div>
      )}

      {!variants || variants.length === 0 ? (
        <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50">
          <p className="text-sm text-neutral-400">
            Templates for{' '}
            <span className="text-white">
              {portfolio.genre.replace('-', ' ')}
            </span>{' '}
            aren&apos;t available yet. We&apos;re designing them now — your
            portfolio will show a default layout once it&apos;s published.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {variants.map((v) => {
            const isSelected = currentSlug === v.slug
            const isSaving = saving === v.slug
            return (
              <button
                key={v.slug}
                onClick={() => selectVariant(v.slug)}
                disabled={isSaving || isSelected}
                className={`group text-left p-5 rounded-xl border transition-colors ${
                  isSelected
                    ? 'border-white bg-neutral-900'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/50'
                } disabled:cursor-default`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{v.label}</h3>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                      <Check className="w-3 h-3" />
                      Selected
                    </span>
                  )}
                  {isSaving && (
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                  )}
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {v.personality}
                </p>
              </button>
            )
          })}
        </div>
      )}

      <p className="text-xs text-neutral-500 mt-6">
        Changes take effect immediately on your published portfolio.
      </p>
    </div>
  )
}
