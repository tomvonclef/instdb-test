import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trivia Master',
  description: 'Test your knowledge across multiple categories!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}