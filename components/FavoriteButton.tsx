'use client'
import { useFavorites } from '@/lib/favorites'

interface Props {
  type: 'shop' | 'park'
  id: string
  variant?: 'hero' | 'icon'
}

export default function FavoriteButton({ type, id, variant = 'hero' }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(type, id)

  const handle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(type, id)
  }

  if (variant === 'icon') {
    return (
      <button onClick={handle} aria-label="お気に入り"
        className="w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
        <Heart filled={active} className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-400'}`} />
      </button>
    )
  }

  return (
    <button onClick={handle}
      className={`flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm transition-all border shrink-0 ${
        active
          ? 'bg-red-50 text-red-600 border-red-200'
          : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:text-red-500'
      }`}>
      <Heart filled={active} className="w-5 h-5" />
      {active ? '保存済み' : '保存'}
    </button>
  )
}

function Heart({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566Z" />
    </svg>
  )
}
