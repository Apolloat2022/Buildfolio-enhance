"use client"

interface CertificateButtonProps {
  projectSlug: string
  isEligible: boolean
}

export default function CertificateButton({ projectSlug, isEligible }: CertificateButtonProps) {
  if (!isEligible) return null

  const handleDownload = () => {
    window.open(`/api/certificate?project=${projectSlug}`, '_blank')
  }

  return (
    <button
      onClick={handleDownload}
      className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 font-semibold shadow-lg"
    >
      🎓 Download Certificate
    </button>
  )
}
