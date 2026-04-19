'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { compressImage } from '@/lib/image/compress'
import type { Portfolio } from '@/types/database'

const profileSchema = z.object({
  display_name: z.string().min(1, 'Name is required').max(100),
  tagline: z.string().max(200),
  bio_bullet_1: z.string().max(200),
  bio_bullet_2: z.string().max(200),
  bio_bullet_3: z.string().max(200),
  social_website: z.string(),
  social_instagram: z.string().max(100),
  social_twitter: z.string().max(100),
  social_linkedin: z.string().max(100),
  social_github: z.string().max(100),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    async function loadPortfolio() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!data) {
        router.push('/dashboard/onboarding')
        return
      }

      setPortfolio(data as Portfolio)
      setPhotoUrl(data.profile_photo_url)
      reset({
        display_name: data.display_name || '',
        tagline: data.tagline || '',
        bio_bullet_1: data.bio_bullets?.[0] || '',
        bio_bullet_2: data.bio_bullets?.[1] || '',
        bio_bullet_3: data.bio_bullets?.[2] || '',
        social_website: data.social_links?.website || '',
        social_instagram: data.social_links?.instagram || '',
        social_twitter: data.social_links?.twitter || '',
        social_linkedin: data.social_links?.linkedin || '',
        social_github: data.social_links?.github || '',
      })
    }
    loadPortfolio()
  }, [reset, router])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setPageError('Please upload a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setPageError('Image must be under 10MB.')
      return
    }

    setUploading(true)
    setPageError(null)

    try {
      const compressed = await compressImage(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
      })

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, compressed, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path)

      setPhotoUrl(publicUrl)

      // Update portfolio with photo URL
      await supabase
        .from('portfolios')
        .update({ profile_photo_url: publicUrl })
        .eq('id', portfolio?.id)
    } catch {
      setPageError('Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: ProfileFormData) {
    if (!portfolio) return
    setSaving(true)
    setPageError(null)

    const supabase = createClient()

    const bioBullets = [data.bio_bullet_1, data.bio_bullet_2, data.bio_bullet_3].filter(
      Boolean
    )

    const socialLinks: Record<string, string> = {}
    if (data.social_website) socialLinks.website = data.social_website
    if (data.social_instagram) socialLinks.instagram = data.social_instagram
    if (data.social_twitter) socialLinks.twitter = data.social_twitter
    if (data.social_linkedin) socialLinks.linkedin = data.social_linkedin
    if (data.social_github) socialLinks.github = data.social_github

    const { error } = await supabase
      .from('portfolios')
      .update({
        display_name: data.display_name,
        tagline: data.tagline || '',
        bio_bullets: bioBullets,
        social_links: socialLinks,
      })
      .eq('id', portfolio.id)

    if (error) {
      setPageError('Failed to save. Please try again.')
      setSaving(false)
      return
    }

    router.push('/dashboard/projects')
  }

  if (!portfolio) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Your Profile</h1>
      <p className="text-neutral-400 mb-8">
        This info appears on your portfolio. You can always edit it later.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-neutral-800">
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  className="absolute top-0 right-0 p-1 bg-neutral-900/80 rounded-full"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <label className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-700 flex items-center justify-center cursor-pointer hover:border-neutral-500 transition-colors">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
                ) : (
                  <Upload className="w-5 h-5 text-neutral-500" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
            <p className="text-xs text-neutral-500">
              JPEG, PNG, or WebP. Max 10MB.
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Display Name *
          </label>
          <input
            {...register('display_name')}
            placeholder="Jane Smith"
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          {errors.display_name && (
            <p className="text-red-400 text-xs mt-1">
              {errors.display_name.message}
            </p>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Tagline
          </label>
          <input
            {...register('tagline')}
            placeholder="Capturing moments that matter"
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>

        {/* Bio Bullets */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            About You (3 bullets)
          </label>
          <p className="text-xs text-neutral-500 mb-2">
            Quick facts about yourself. AI will turn these into a polished bio.
          </p>
          <div className="space-y-2">
            <input
              {...register('bio_bullet_1')}
              placeholder="e.g. 10 years of portrait photography"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              {...register('bio_bullet_2')}
              placeholder="e.g. Based in Brooklyn, NY"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              {...register('bio_bullet_3')}
              placeholder="e.g. Published in Vogue and The New York Times"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Social Links (optional)
          </label>
          <div className="space-y-2">
            <input
              {...register('social_website')}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              {...register('social_instagram')}
              placeholder="Instagram username"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              {...register('social_twitter')}
              placeholder="X / Twitter username"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              {...register('social_linkedin')}
              placeholder="LinkedIn username"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              {...register('social_github')}
              placeholder="GitHub username"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        {pageError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {pageError}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save & Continue to Projects'}
        </button>
      </form>
    </div>
  )
}
