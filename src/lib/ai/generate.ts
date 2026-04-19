import OpenAI from 'openai'
import type { Genre } from '@/types/database'

let _client: OpenAI | null = null
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.KIMI_API_KEY,
      baseURL: 'https://api.moonshot.ai/v1',
    })
  }
  return _client
}

const genreLabels: Record<Genre, string> = {
  photographer: 'photographer',
  'graphic-designer': 'graphic designer',
  'ui-ux-designer': 'UI/UX designer',
  writer: 'writer and journalist',
  '3d-artist': '3D artist and animator',
  developer: 'software developer and engineer',
}

export async function generateBio(
  genre: Genre,
  name: string,
  bullets: string[]
): Promise<string> {
  const bulletsText = bullets.filter(Boolean).join('; ')

  const response = await getClient().chat.completions.create({
    model: 'kimi-k2-0711',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Write a polished, professional 3-4 sentence bio paragraph for a ${genreLabels[genre]} named ${name}. Here are facts about them: ${bulletsText}. Write in third person. Be concise and compelling. No fluff. Return only the bio text, nothing else.`,
      },
    ],
  })

  return response.choices[0]?.message?.content || ''
}

export async function generateProjectDescription(
  genre: Genre,
  projectTitle: string,
  keywords?: string
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'kimi-k2-0711',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: `Write a 2-sentence description for a ${genreLabels[genre]}'s project titled "${projectTitle}"${keywords ? `. Keywords: ${keywords}` : ''}. Be specific and professional. Return only the description text, nothing else.`,
      },
    ],
  })

  return response.choices[0]?.message?.content || ''
}

export async function generateHeadline(genre: Genre): Promise<string> {
  const headlines: Record<Genre, string[]> = {
    photographer: ['Selected Works', 'Portfolio', 'Through the Lens'],
    'graphic-designer': ['Selected Work', 'Creative Portfolio', 'Projects'],
    'ui-ux-designer': ['Case Studies', 'Selected Projects', 'Design Work'],
    writer: ['Published Writing', 'Selected Works', 'Writing Portfolio'],
    '3d-artist': ['Showcase', 'Creative Reel', 'Selected Projects'],
    developer: ['Projects', 'Selected Work', 'Engineering Portfolio'],
  }

  const options = headlines[genre] || ['Portfolio']
  return options[Math.floor(Math.random() * options.length)]
}
