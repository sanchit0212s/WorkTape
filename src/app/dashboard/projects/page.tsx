'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, GripVertical, Pencil, Trash2, Loader2, ImageIcon } from 'lucide-react'
import type { Project, Portfolio, ProjectImage } from '@/types/database'

type ProjectWithImages = Project & { project_images: ProjectImage[] }

export default function ProjectsPage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [projects, setProjects] = useState<ProjectWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

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

    const { data: projs } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('portfolio_id', pf.id)
      .order('sort_order', { ascending: true })

    setProjects((projs as ProjectWithImages[]) || [])
    setLoading(false)
  }

  async function handleDelete(projectId: string) {
    if (!confirm('Delete this project and all its images?')) return
    setDeleting(projectId)

    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', projectId)
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
    setDeleting(null)
  }

  async function moveProject(index: number, direction: 'up' | 'down') {
    const newProjects = [...projects]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newProjects.length) return

    ;[newProjects[index], newProjects[swapIndex]] = [
      newProjects[swapIndex],
      newProjects[index],
    ]

    setProjects(newProjects)

    const supabase = createClient()
    await Promise.all(
      newProjects.map((p, i) =>
        supabase.from('projects').update({ sort_order: i }).eq('id', p.id)
      )
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    )
  }

  const canAddMore = projects.length < 5

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {projects.length}/5 projects
          </p>
        </div>
        {canAddMore && (
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 mb-4">No projects yet.</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
            >
              {/* Reorder */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveProject(index, 'up')}
                  disabled={index === 0}
                  className="text-neutral-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                {project.project_images?.[0] ? (
                  <img
                    src={project.project_images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {project.title}
                </h3>
                <p className="text-sm text-neutral-500">
                  {project.project_images?.length || 0} images
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleting === project.id}
                  className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                >
                  {deleting === project.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Link
          href="/dashboard/onboarding/profile"
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          &larr; Back to Profile
        </Link>
        <Link
          href="/dashboard/publish"
          className="px-6 py-2 rounded-lg bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
        >
          Continue to Publish
        </Link>
      </div>
    </div>
  )
}
