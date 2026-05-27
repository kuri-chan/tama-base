export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Shop, Park } from '@/types'

const CATEGORIES = [
  { label: 'カフェ', icon: '☕', value: 'カフェ' },
  { label: '飲食', icon: '🍽️', value: '飲食' },
  { label: 'スイーツ', icon: '🍰', value: 'スイーツ' },
  { label: '小売', icon: '🛍️', value: '小売' },
  { label: '美容', icon: '✂️', value: '美容' },
  { label: 'その他', icon: '📍', value: 'その他' },
]

export default async function HomePage() {
  const [
    { data: newShops },
    { data: childShops },
    { data: parks },
    { count: shopCount },
    { count: parkCount },
    { count: newCount },
  ] = await Promise.all([
    supabase.from('shops').select('*').eq('is_new_open', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('shops').select('*').eq('child_friendly', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('parks').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('shops').select('*', { count: 'exact', head: true }),
    supabase.from('parks').select('*', { count: 'exact', head: true }),
    supabase.from('shops').select('*', { count: 'exact', head: true }).eq('is_new_open', true),
  ])

  return (
    <div className="pb-12">

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white px-4 pt-10 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-green-200 text-sm font-medium tracking-widest mb-2">川崎市多摩区の地域情報</p>
            <h1 className="text-4xl font-black tracking-tight mb-3">
              多摩区のすべてが、<br className="sm:hidden"/>ここに。
            </h1>
            <p className="text-green-100 text-sm leading-relaxed max-w-sm mx-auto">
              お店・公園・子育て情報をまとめてチェック。<br/>
              まちの新しい魅力を発見しよう。
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-3 mb-8">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-black">{shopCount ?? 0}</div>
              <div className="text-green-100 text-xs mt-0.5">登録店舗</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-black">{newCount ?? 0}</div>
              <div className="text-green-100 text-xs mt-0.5">NEW OPEN</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-black">{parkCount ?? 0}</div>
              <div className="text-green-100 text-xs mt-0.5">登録公園</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 justify-center">
            <Link href="/shops"
              className="bg-white text-green-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-green-50 transition-colors shadow-lg">
              🏪 お店を探す
            </Link>
            <Link href="/parks"
              className="bg-green-600 text-white px-6 py-3 rounded-full font-bold text-sm border-2 border-white/40 hover:bg-green-500 transition-colors shadow-lg">
              🏞️ 公園を探す
            </Link>
          </div>
        </div>
      </section>

      {/* ===== カテゴリから探す ===== */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-base font-bold text-gray-700 mb-3">カテゴリから探す</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.value}
              href={`/shops?category=${cat.value}`}
              className="bg-white border border-gray-200 rounded-2xl py-3 flex flex-col items-center gap-1.5 hover:border-green-400 hover:shadow-sm transition-all">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== NEW OPEN ===== */}
      {newShops && newShops.length > 0 && (
        <section className="py-2">
          <div className="max-w-4xl mx-auto px-4 mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">🆕 NEW OPEN</h2>
              <p className="text-xs text-gray-500 mt-0.5">最近オープンしたお店</p>
            </div>
            <Link href="/shops?filter=new" className="text-green-600 text-sm font-medium hover:underline">
              すべて見る →
            </Link>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide snap-x snap-mandatory">
            {newShops.map((shop: Shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex-shrink-0 w-52 snap-start">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW OPEN</span>
                  {shop.child_friendly && <span className="text-base">👶</span>}
                </div>
                <div className="font-bold text-sm text-gray-900 mb-1 leading-snug line-clamp-2">{shop.name}</div>
                <div className="text-xs text-gray-500 mb-2">{shop.category}</div>
                {shop.hours && (
                  <div className="text-xs text-gray-400">🕐 {shop.hours}</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 子連れOK ===== */}
      {childShops && childShops.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">👶 子連れで行けるお店</h2>
              <p className="text-xs text-gray-500 mt-0.5">ベビーカーOK・キッズメニューあり</p>
            </div>
            <Link href="/shops?filter=child" className="text-green-600 text-sm font-medium hover:underline">
              すべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {childShops.map((shop: Shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xl">
                    {shop.category === 'カフェ' ? '☕' :
                     shop.category === 'スイーツ' ? '🍰' :
                     shop.category === '飲食' ? '🍽️' :
                     shop.category === '小売' ? '🛍️' : '🏪'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 mb-1 truncate">{shop.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{shop.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {shop.stroller_ok && (
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">ベビーカーOK</span>
                    )}
                    {shop.kids_menu && (
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">キッズメニュー</span>
                    )}
                    {shop.nursing_room && (
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">授乳室</span>
                    )}
                  </div>
                </div>
                {shop.is_new_open && (
                  <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full shrink-0">NEW</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 公園 ===== */}
      {parks && parks.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">🏞️ 公園を探す</h2>
              <p className="text-xs text-gray-500 mt-0.5">遊具・設備・対象年齢から選ぼう</p>
            </div>
            <Link href="/parks" className="text-green-600 text-sm font-medium hover:underline">
              すべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parks.map((park: Park) => (
              <Link
                key={park.id}
                href={`/parks/${park.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-gray-900 mb-0.5">{park.name}</div>
                    <div className="text-xs text-gray-400">{park.address}</div>
                  </div>
                  {park.age_range && (
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {park.age_range}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mb-2">
                  {park.has_toilet && <span>🚻 トイレ</span>}
                  {park.has_parking && <span>🅿️ 駐車場</span>}
                  {park.has_bench && <span>🪑 ベンチ</span>}
                  {park.has_shade && <span>🌳 日陰</span>}
                </div>
                {park.equipment && park.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {park.equipment.slice(0, 3).map((item: string) => (
                      <span key={item} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                        {item}
                      </span>
                    ))}
                    {park.equipment.length > 3 && (
                      <span className="text-xs text-gray-400">+{park.equipment.length - 3}</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== MAP CTA ===== */}
      <section className="max-w-4xl mx-auto px-4 py-4 mt-2">
        <Link href="/map"
          className="block bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-lg mb-1">🗺️ エリアマップで探す</div>
              <div className="text-green-100 text-sm">お店と公園を地図上で確認できます</div>
            </div>
            <div className="text-3xl">→</div>
          </div>
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-4 text-center">
        <p className="text-xs text-gray-400">© 2025 TAMA BASE — 川崎市多摩区の地域情報プラットフォーム</p>
      </footer>

    </div>
  )
}
