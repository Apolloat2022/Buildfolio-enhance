"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CertificateFloatingButton() {
  const [hasCertificates, setHasCertificates] = useState(false)

  useEffect(() => {
    fetch('/api/user/has-certificates')
      .then(res => res.json())
      .then(data => setHasCertificates(data.hasCertificates))
      .catch(() => {})
  }, [])

  if (!hasCertificates) return null

  return (
    <Link
      href="/certificates"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-2xl hover:from-yellow-500 hover:to-orange-600 font-semibold animate-bounce"
      style={{ animationDuration: '2s' }}
    >
      🎓 My Certificates
    </Link>
  )
}
