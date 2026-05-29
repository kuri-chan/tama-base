'use client'
import { useCallback, useEffect, useState } from 'react'

export type FavItem = { type: 'shop' | 'park'; id: string }
const KEY = 'tama-base-favorites'

function read(): FavItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function write(items: FavItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  // 同一タブ内の他コンポーネントにも通知
  window.dispatchEvent(new Event('favorites-changed'))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavItem[]>([])

  useEffect(() => {
    setFavorites(read())
    const sync = () => setFavorites(read())
    window.addEventListener('favorites-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('favorites-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isFavorite = useCallback(
    (type: FavItem['type'], id: string) => favorites.some(f => f.type === type && f.id === id),
    [favorites]
  )

  const toggle = useCallback((type: FavItem['type'], id: string) => {
    const current = read()
    const exists = current.some(f => f.type === type && f.id === id)
    const next = exists
      ? current.filter(f => !(f.type === type && f.id === id))
      : [...current, { type, id }]
    write(next)
    setFavorites(next)
    return !exists
  }, [])

  return { favorites, isFavorite, toggle }
}
