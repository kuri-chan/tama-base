'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <nav className="bg-green-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wider flex items-center gap-1.5">
          <span className="text-xl">🗾</span>
          <span>TAMA BASE</span>
        </Link>
        <div className="flex items-center gap-0.5">
          <Link
            href="/shops"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/shops') ? 'bg-white/20' : 'hover:bg-white/10'
            }`}>
            🏪 お店
          </Link>
          <Link
            href="/parks"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/parks') ? 'bg-white/20' : 'hover:bg-white/10'
            }`}>
            🏞️ 公園
          </Link>
          <Link
            href="/map"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/map') ? 'bg-white/20' : 'hover:bg-white/10'
            }`}>
            🗺️ MAP
          </Link>
        </div>
      </div>
    </nav>
  )
}
