'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Shop, Park } from '@/types'
import { useFavorites } from '@/lib/favorites'
import CategoryVisual from '@/components/CategoryVisual'
import FavoriteButton from '@/components/FavoriteButton'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [shops, setShops] = useState<Shop[]>([])
  const [parks, setParks] = useState<Park[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const shopIds = favorites.filter(f => f.type === 'shop').map(f => f.id)
    const parkIds = favorites.filter(f => f.type === 'park').map(f => f.id)
    Promise.all([
      shopIds.length ? supabase.from('shops').select('*').in('id', shopIds) : Promise.resolve({ data: [] }),
      parkIds.length ? supabase.from('parks').select('*').in('id', parkIds) : Promise.resolve({ data: [] }),
    ]).then(([s, p]) => {
      setShops(s.data || [])
      setParks(p.data || [])
      setLoading(false)
    })
  }, [favorites])

  const total = shops.length + parks.length

  return (
    <div className="pb-24 min-h-dvh">
      {/* ヘッダー */}
      <div className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-10 px-4 pt-4 pb-3">
        <div className="max-w-4xl mx-auto flex items-baseline justify-between">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span className="text-red-500">♥</span> お気に入り
          </h1>
          <span className="text-sm text-gray-400 tabular-nums">{total}件</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        {loading && favorites.length > 0 ? (
          <div className="text-center text-gray-400 py-20 text-sm">読み込み中...</div>
        ) : total === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-gray-700 font-bold mb-1">まだ保存はありません</p>
            <p className="text-gray-400 text-sm mb-5">気になるお店や公園を保存しておけます</p>
            <Link href="/shops"
              className="inline-block bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-green-800 transition-colors">
              お店を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {shops.map(shop => (
              <Link key={`s-${shop.id}`} href={`/shops/${shop.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
                <div className="relative aspect-[3/2]">
                  {shop.images?.[0] ? (
                    <Image src={shop.images[0]} alt={shop.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 33vw" />
                  ) : (
                    <CategoryVisual category={shop.category} name={shop.name} />
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton type="shop" id={shop.id} variant="icon" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-gray-900 line-clamp-1">{shop.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{shop.category}</div>
                </div>
              </Link>
            ))}
            {parks.map(park => (
              <Link key={`p-${park.id}`} href={`/parks/${park.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
                <div className="relative aspect-[3/2]">
                  {park.images?.[0] ? (
                    <Image src={park.images[0]} alt={park.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 33vw" />
                  ) : (
                    <CategoryVisual category="公園" name={park.name} />
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton type="park" id={park.id} variant="icon" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-gray-900 line-clamp-1">{park.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">公園</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
