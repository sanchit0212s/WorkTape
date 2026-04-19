'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

export function DashboardNav({ user }: { user: User }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-white tracking-tight"
        >
          Worktape
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Settings
          </Link>
          <span className="text-sm text-neutral-500">{displayName}</span>
          <button
            onClick={handleSignOut}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-neutral-400"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-neutral-800 px-4 py-3 space-y-3">
          <Link
            href="/dashboard"
            className="block text-sm text-neutral-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="block text-sm text-neutral-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </Link>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <span className="text-sm text-neutral-500">{displayName}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
