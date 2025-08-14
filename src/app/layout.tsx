import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NYC Theatre — Broadway & Off-Broadway',
  description: 'Find Broadway and Off-Broadway shows with summaries, filters, and low-cost ticket tips.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-screen-sm pb-[72px]">{children}</div>
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/90 backdrop-blur-sm" style={{ paddingBottom: 'var(--safe-bottom)' }}>
          <div className="mx-auto max-w-screen-sm px-4 py-2 flex items-center gap-4 justify-between text-sm">
            <a href="/" className="font-semibold">Shows</a>
            <a href="#tips" className="text-gray-600">Saving tips</a>
            <a href="https://www.tdf.org/tkts/" target="_blank" className="text-gray-600">TKTS</a>
          </div>
        </nav>
      </body>
    </html>
  )
}
