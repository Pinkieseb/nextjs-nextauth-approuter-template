import type { Metadata } from "next"
import { getAuthSession } from "@/lib/auth"
import { Providers } from './providers'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Advanced authentication in Next.js',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
