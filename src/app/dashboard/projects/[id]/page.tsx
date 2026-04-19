'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { compressImage } from '@/lib/image/compress'
import type { Project, ProjectImage } from '@/types/database'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([])
  const [newImages, setNewImages] = useState<
    { file: File; preview: string; uploading: boolean }[]
  >([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .eq('id', projectId)
        .single()

      if (!data) {
        router.push('/dashboard/projects')
        return
      }

      setProject(data as Project)
      setExistingImages(
        (data.project_images as ProjectImage[])?.sort(
          (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
        ) || []
      )
      reset({
        title: data.title,
        description: data.description || '',
      })
    }
    load()
  }, [projectId, reset, router])

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed.')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be under 10MB.')
        return
      }
    }

    setError(null)
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }))
    setNewImages((prev) => [...prev, ...newImgs])
  }

  async function removeExistingImage(image: ProjectImage) {
    const supabase = createClient()
    await supabase.storage.from('project-images').remove([image.storage_path])
    await supabase.from('project_images').delete().eq('id', image.id)
    setExistingImages((prev) => prev.filter((i) => i.id !== image.id))
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function onSubmit(data: ProjectFormData) {
    if (!project) return
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Update project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        title: data.title,
        description: data.description || null,
      })
      .eq('id', project.id)

    if (updateError) {
      setError('Failed to update project.')
      setSaving(false)
      return
    }

    // Upload new images
    const startOrder = existingImages.length
    for (let i = 0; i < newImages.length; i++) {
      setNewImages((prev) =>
        prev.map((img, idx) =>
          idx === i ? { ...img, uploading: true } : img
        )
      )

      try {
        const compressed = await compressImage(newImages[i].file)
        const ext = newImages[i].file.name.split('.').pop() || 'jpg'
        const path = `${user.id}/${project.id}/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(path, compressed)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('project-images').getPublicUrl(path)

        await supabase.from('project_images').insert({
          project_id: project.id,
          storage_path: path,
          url: publicUrl,
          sort_order: startOrder + i,
        })
      } catch {
        console.error(`Failed to upload image ${i + 1}`)
      }
    }

    router.push('/dashboard/projects')
  }

  if (!project) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Edit Project</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Project Title *
          </label>
          <input
            {...register('title')}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
          />
        </div>

        {/* Existing Images */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Images
          </label>
          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800"
                >
                  <img
                    src={img.url}
                    alt={img.alt_text || ''}
                    className="w-full h-full object-cover"
                  />
                  {!saving && (
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute top-1 right-1 p-1 bg-neutral-900/80 rounded-full"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ))}
              {newImages.map((img, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800"
                >
                  <img
                    src={img.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    </div>
                  )}
                  {!saving && (
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-neutral-900/80 rounded-full"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-500 transition-colors">
            <Upload className="w-5 h-5 text-neutral-500" />
            <span className="text-sm text-neutral-400">Add more images</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={saving}
            />
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
