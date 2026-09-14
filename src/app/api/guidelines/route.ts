import { NextRequest, NextResponse } from 'next/server'

// Gist-based guidelines: read/write via GitHub Gist API (avoids CDN cache on raw URL)
const GIST_ID = process.env.GITHUB_GIST_ID || 'ef31d9c486319fc61b4f8a3e721ee442'
const GIST_FILENAME = 'guidelines.json'
const GIST_OWNER = 'guonodev'
// Fallback raw URL only if API fails (e.g. no token)
const DEFAULT_RAW_URL = `https://gist.githubusercontent.com/${GIST_OWNER}/${GIST_ID}/raw/${GIST_FILENAME}`
const GIST_RAW_URL = process.env.GITHUB_GIST_RAW_URL || DEFAULT_RAW_URL

// Always fetch fresh; do not cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const token = process.env.GITHUB_GIST_TOKEN

  try {
    // Prefer GitHub Gist API so we get the latest revision immediately (raw URL is CDN-cached ~3–5 min)
    if (token) {
      const apiRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        cache: 'no-store',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      if (apiRes.ok) {
        const gist = await apiRes.json()
        const file = gist.files?.[GIST_FILENAME]
        if (file?.content != null) {
          const data = JSON.parse(file.content)
          return NextResponse.json(
            { success: true, data },
            {
              headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                Pragma: 'no-cache',
              },
            }
          )
        }
      }
      // If API failed or file missing, fall through to raw URL
    }

    // Fallback: raw URL (may be CDN-cached for a few minutes)
    const res = await fetch(GIST_RAW_URL, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })
    if (!res.ok) {
      throw new Error(`Gist fetch failed: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
        },
      }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to read guidelines'
    console.error('Error reading guidelines from gist:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const token = process.env.GITHUB_GIST_TOKEN
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'GITHUB_GIST_TOKEN is not configured. Add it to .env.local to save guidelines to the gist.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No data provided' },
        { status: 400 }
      )
    }

    const content = JSON.stringify(data, null, 2)

    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: { content },
        },
      }),
    })

    if (!gistRes.ok) {
      const errBody = await gistRes.text()
      console.error('GitHub Gist API error:', gistRes.status, errBody)
      if (gistRes.status === 401) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired GitHub token. Check GITHUB_GIST_TOKEN.' },
          { status: 401 }
        )
      }
      if (gistRes.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Gist not found or token has no access.' },
          { status: 404 }
        )
      }
      throw new Error(`Gist update failed: ${gistRes.status}`)
    }

    return NextResponse.json({ success: true, message: 'Guidelines updated successfully' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save guidelines'
    console.error('Error saving guidelines to gist:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
