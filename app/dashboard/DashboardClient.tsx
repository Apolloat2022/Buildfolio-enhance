interface Project {
  id: string
  title: string
  description: string
  status: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  createdAt: Date
  updatedAt: Date
}
