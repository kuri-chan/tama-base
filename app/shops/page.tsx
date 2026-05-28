export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Shop } from '@/types'

const CATEGORY_GRADIENT: Record<string, string> = {
  カフェ: 'from-amber-400 to-orange-400',
  飲食: 'from-red-400 to-orange-400',
  スイーツ: 'from-pink-400 to-fuchsia-400',
  小売: 'from-blue-400 to-sky-400',
  美容: 'from-purple-400 to-violet-400',
  サービス: 'from-indigo-400 to-blue-400',
  医療: 'from-teal-400 to-emerald-400',
  その他: 'from-gray-400 to-slate-400',
}

const CATEGORY_ICON: Record<string, string> = {
  カフェ: '☕', 飲食: '🍽️', スイーツ: '🍰', 小売: '🛍️',
  美容: '✂️', サービス: '🔧', 医療: '🏥', その他: '📍',
}

const FILTER_CHIPS = [
  { href: '/shops', label: 'すべて', color: 'green' },
  { href: '/shops?filter=new', label: 'NEW OPEN', color: 'red' },
  { href: '/shops?filter=child', label: '子連れOK', color: 'blue' },
  { href: '/shops?category=カフェ', label: '☕ カフェ', color: 'green' },
  { href: '/shops?category=飲食', label: '🍽️ 飲食', color: 'green' },
  { href: '/shops?category=スイーツ', label: '🍰 スイーツ', color: 'green' },
  { href: '/shops?category=小売', label: '🛍️ 小売', color: 'green' },
  { href: '/shops?category=美容', label: '✂️ 美容', color: 'green' },
  { href: '/shops?category=サービス', label: '🔧 サービス', color: 'green' },
  { href: '/shops?category=医療', label: '🏥 医療', color: 'green' },
  { href: '/shops?category=その他', label: '📍 その他', color: 'green' },
]

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const filter = params.filter

  let query = supabase.from('shops').select('*')
    .order('is_new_open', { ascending: false })
    .order('created_at', { ascending: false })
  if (category && category !== 'すべて') query = query.eq('category', category)
  if (filter === 'new') query = query.eq('is_new_open', true)
  if (filter === 'child') query = query.eq('child_friendly', true)

  const { data: shops } = await query

  // Determine active chip
  const activeHref = filter === 'new' ? '/shops?filter=new'
    : filter === 'child' ? '/shops?filter=child'
    : category ? `/shops?category=${category}`
    : '/shops'

  return (
    <div className="pb-24">

      {/* Sticky header */}
      <div className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-10 px-4 pt-4 pb-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-3">
            <h1 className="text-xl font-black text-gray-900">お店</h1>
            <span className="text-sm text-gray-400 tabular-nums">{shops?.length ?? 0}件</span>
          </div>
          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {FILTER_CHIPS.map(chip => {
              const active = chip.href === activeHref
              const activeClass =
                chip.color === 'red' ? 'bg-red-500 text-white border-red-500'
                : chip.color === 'blue' ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-green-700 text-white border-green-700'
              return (
                <Link key={chip.href} href={chip.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap shrink-0 transition-all ${
                    active ? activeClass : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                  {chip.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {shops && shops.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {shops.map((shop: Shop) => {
              const gradient = CATEGORY_GRADIENT[shop.category] || 'from-gray-300 to-gray-400'
              const icon = CATEGORY_ICON[shop.category] || '🏪'
              return (
                <Link key={shop.id} href={`/shops/${shop.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
                  <div className="relative aspect-[3/2]">
                    {shop.images?.[0] ? (
                      <Image src={shop.images[0]} alt={shop.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <span className="text-4xl drop-shadow">{icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {shop.is_new_open && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        NEW
                      </span>
                    )}
                    {shop.child_friendly && (
                      <span className="absolute top-2 right-2 bg-white/85 text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                        👶
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm text-gray-900 line-clamp-1">{shop.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{shop.category}</div>
                    {shop.hours && (
                      <div className="text-[10px] text-gray-400 mt-1">🕐 {shop.hours}</div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium text-sm mb-3">該当するお店が見つかりません</p>
            <Link href="/shops" className="text-green-700 text-sm font-bold hover:underline">
              すべてのお店を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
