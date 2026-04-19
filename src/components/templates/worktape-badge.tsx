type Theme = 'light' | 'dark'

/**
 * Footer attribution chip rendered by every template.
 *
 * `theme`:
 *   - 'dark' (default) — for dark/black page backgrounds. Translucent white chip.
 *   - 'light' — for light/cream page backgrounds. Translucent dark chip.
 */
export function WorktapeBadge({ theme = 'dark' }: { theme?: Theme } = {}) {
  const styles =
    theme === 'light'
      ? 'bg-black/5 text-black/60 hover:text-black/80'
      : 'bg-white/10 text-white/60 hover:text-white/80 backdrop-blur-sm'

  return (
    <a
      href="https://worktape.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${styles}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      Built with Worktape
    </a>
  )
}
