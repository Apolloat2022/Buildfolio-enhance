"use client"
import Link from 'next/link'

interface CertificatesLinkProps {
  count: number
}

export default function CertificatesLink({ count }: CertificatesLinkProps) {
  if (count === 0) return null
  
  return (
    <Link 
      href="/certificates"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 font-semibold shadow-lg"
    >
      🎓 View My Certificates ({count})
    </Link>
  )
}
