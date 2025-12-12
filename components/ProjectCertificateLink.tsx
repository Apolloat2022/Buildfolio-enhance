"use client"
import Link from 'next/link'

interface ProjectCertificateLinkProps {
  projectSlug: string
  certificateEligible: boolean
}

export default function ProjectCertificateLink({ projectSlug, certificateEligible }: ProjectCertificateLinkProps) {
  if (!certificateEligible) return null
  
  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">🎓 Certificate Available!</span>
        <Link 
          href={`/api/certificate?project=${projectSlug}`}
          target="_blank"
          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 text-sm font-semibold"
        >
          Download Certificate
        </Link>
      </div>
    </div>
  )
}
