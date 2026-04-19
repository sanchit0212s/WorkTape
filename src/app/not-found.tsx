import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-neutral-400 mt-4 mb-8">
          This portfolio doesn&apos;t exist yet.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors"
        >
          Go to Worktape
        </Link>
      </div>
    </div>
  )
}
