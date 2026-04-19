'use client'

// Horizontal filmstrip: drag-to-scroll on desktop, native swipe on mobile.
// Keyboard: left/right arrows scroll by one image width when focused.
import { useRef, type KeyboardEvent } from 'react'
import type { ProjectImage } from '@/types/database'

interface Props {
  images: ProjectImage[]
  alt: string
}

export function HorizontalTrack({ images, alt }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const first = ref.current.querySelector('img') as HTMLElement | null
    const step = first ? first.getBoundingClientRect().width + 16 : 400
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      ref.current.scrollBy({ left: step, behavior: 'smooth' })
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      ref.current.scrollBy({ left: -step, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label={`${alt} — photo track, use arrow keys to scroll`}
      onKeyDown={onKey}
      className="flex gap-4 px-6 md:px-8 overflow-x-auto focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8c867c] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#222]"
    >
      {images.map((im, i) => (
        <img
          key={im.id}
          src={im.url}
          alt={im.alt_text || alt || ''}
          loading={i === 0 ? 'eager' : 'lazy'}
          className="h-[60vh] md:h-[72vh] max-h-[640px] w-auto block bg-[#111] flex-none"
        />
      ))}
    </div>
  )
}
