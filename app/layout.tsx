import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ToastContainer from "@/components/ToastContainer"
import CertificateFloatingButton
import GlobalAIHelper from "@/components/GlobalAIHelper" from "@/components/CertificateFloatingButton"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Buildfolio - Build Portfolio Projects",
  description: "Learn by building real projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToastContainer />
          <CertificateFloatingButton />
          <GlobalAIHelper />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

