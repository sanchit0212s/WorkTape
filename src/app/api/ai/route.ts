import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateBio,
  generateProjectDescription,
  generateHeadline,
} from '@/lib/ai/generate'
import type { Genre } from '@/types/database'

export async function POST(request: Request) {
  try {
    // Authenticate
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, genre, name, bullets, projectTitle, keywords } = body

    if (!type || !genre) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let result: string

    switch (type) {
      case 'bio':
        if (!name || !bullets) {
          return NextResponse.json(
            { error: 'Name and bullets required for bio' },
            { status: 400 }
          )
        }
        result = await generateBio(genre as Genre, name, bullets)
        break

      case 'project-description':
        if (!projectTitle) {
          return NextResponse.json(
            { error: 'Project title required' },
            { status: 400 }
          )
        }
        result = await generateProjectDescription(
          genre as Genre,
          projectTitle,
          keywords
        )
        break

      case 'headline':
        result = await generateHeadline(genre as Genre)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed. You can type your own text instead.' },
      { status: 500 }
    )
  }
}
