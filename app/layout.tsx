import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fabulosa Books Scheduler',
  description: 'Employee shift scheduling for Fabulosa Books bookstore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-fab-pink text-fab-dark">
        {children}
      </body>
    </html>
  )
}
