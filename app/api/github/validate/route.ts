import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { githubUrl } = await req.json()

    if (!githubUrl) {
      return NextResponse.json({ 
        valid: false, 
        error: 'GitHub URL is required' 
      }, { status: 400 })
    }

    // Extract owner and repo from URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid GitHub URL format. Use: https://github.com/username/repo' 
      })
    }

    const [_, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '') // Remove .git if present

    // Call GitHub API to check if repo exists
    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Buildfolio-App'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ 
          valid: false, 
          error: 'Repository not found. Make sure it exists and is public.' 
        })
      }
      return NextResponse.json({ 
        valid: false, 
        error: 'Failed to validate repository. Please try again.' 
      })
    }

    const repoData = await response.json()

    // Get recent commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Buildfolio-App'
        }
      }
    )

    let lastCommitDate = null
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json()
      if (commits.length > 0) {
        lastCommitDate = commits[0].commit.author.date
      }
    }

    // Check for package.json (indicates it's a real project)
    const packageJsonResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/contents/package.json`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Buildfolio-App'
        }
      }
    )

    const hasPackageJson = packageJsonResponse.ok

    return NextResponse.json({
      valid: true,
      repoName: repoData.full_name,
      commits: repoData.stargazers_count || 0, // Using stars as proxy
      lastCommit: lastCommitDate || repoData.updated_at,
      hasPackageJson,
      isRecent: Date.now() - new Date(repoData.updated_at).getTime() < 30 * 24 * 60 * 60 * 1000
    })

  } catch (error) {
    console.error('GitHub validation error:', error)
    return NextResponse.json({ 
      valid: false, 
      error: 'An error occurred while validating the repository' 
    }, { status: 500 })
  }
}
