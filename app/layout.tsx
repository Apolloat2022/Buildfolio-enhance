import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ToastContainer from "@/components/ToastContainer"
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
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}