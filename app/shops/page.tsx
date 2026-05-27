import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Shop } from '@/types'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['すべて', '飲食', 'カフェ', 'スイーツ', '小売', 'サービス', '美容', '医療', 'その他']
const CATEGORY_ICONS: Record<string, string> = {
  飲食: '🍽️', カフェ: '☕', スイーツ: '🍰', 小売: '🛍️',
  サービス: '🔧', 美容: '✂️', 医療: '🏥', その他: '📍',
}

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const filter = params.filter

  let query = supabase.from('shops').select('*').order('is_new_open', { ascending: false }).order('created_at', { ascending: false })
  if (category && category !== 'すべて') query = query.eq('category', category)
  if (filter === 'new') query = query.eq('is_new_open', true)
  if (filter === 'child') query = query.eq('child_friendly', true)

  const { data: shops } = await query

  const activeLabel = filter === 'new' ? 'NEW OPEN' : filter === 'child' ? '子連れOK' : category || 'すべて'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* ヘッダー */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">🏪 お店一覧</h1>
        <p className="text-sm text-gray-500 mt-1">
          {shops?.length ?? 0}件のお店
          {activeLabel !== 'すべて' && <span className="ml-1 text-green-600 font-medium">（{activeLabel}）</span>}
        </p>
      </div>

      {/* フィルタータブ */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <Link href="/shops"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !filter && !category ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
          }`}>
          すべて
        </Link>
        <Link href="/shops?filter=new"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            filter === 'new' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'
          }`}>
          🆕 NEW OPEN
        </Link>
        <Link href="/shops?filter=child"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            filter === 'child' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
          }`}>
          👶 子連れOK
        </Link>
      </div>

      {/* カテゴリ横スクロール */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <Link key={cat}
            href={cat === 'すべて' ? '/shops' : `/shops?category=${cat}`}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border font-medium transition-colors ${
              (category === cat || (cat === 'すべて' && !category && !filter))
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
            }`}>
            {CATEGORY_ICONS[cat] && <span className="mr-1">{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </Link>
        ))}
      </div>

      {/* お店リスト */}
      {shops && shops.length > 0 ? (
        <div className="flex flex-col gap-3">
          {shops.map((shop: Shop) => (
            <Link key={shop.id} href={`/shops/${shop.id}`}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all hover:border-green-200 flex items-start gap-3">

              {/* カテゴリアイコン */}
              <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 text-xl border border-gray-100">
                {CATEGORY_ICONS[shop.category] || '🏪'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-bold text-gray-900 truncate">{shop.name}</span>
                  {shop.is_new_open && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold shrink-0">NEW OPEN</span>
                  )}
                </div>
                <div className="text-gray-400 text-xs mb-2">{shop.category} · {shop.address}</div>
                <div className="flex flex-wrap gap-1">
                  {shop.child_friendly && (
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">👶 子連れOK</span>
                  )}
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

              <span className="text-gray-300 text-xl ml-1 shrink-0">›</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 font-medium">該当するお店が見つかりません</p>
          <Link href="/shops" className="text-green-600 text-sm mt-3 inline-block hover:underline">
            すべてのお店を見る
          </Link>
        </div>
      )}
    </div>
  )
}
