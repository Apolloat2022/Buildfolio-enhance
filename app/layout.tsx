import type { Metadata } from "next"
import { Inter } from "next/font/google"
import BlockWalletInjection from '@/components/BlockWalletInjection'
import "./globals.css"
import ToastContainer from "@/components/ToastContainer"
import CertificateFloatingButton from "@/components/CertificateFloatingButton"
import GlobalAIHelper from "@/components/GlobalAIHelper"
import Navigation from "@/components/Navigation"
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
  <BlockWalletInjection />
        <SessionProvider>
          <Navigation />
          <ToastContainer />
          <CertificateFloatingButton />
          <GlobalAIHelper />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

