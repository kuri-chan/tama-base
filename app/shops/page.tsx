import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Shop } from '@/types'

const CATEGORIES = ['すべて', '飲食', 'カフェ', '小売', 'サービス', '美容', '医療', 'その他']

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const filter = params.filter

  let query = supabase.from('shops').select('*').order('created_at', { ascending: false })
  if (category && category !== 'すべて') query = query.eq('category', category)
  if (filter === 'new') query = query.eq('is_new_open', true)
  if (filter === 'child') query = query.eq('child_friendly', true)

  const { data: shops } = await query

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-5">🏪 お店一覧</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Link href="/shops"
          className={`px-3 py-1.5 rounded-full text-sm border ${!filter && !category ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'}`}>
          すべて
        </Link>
        <Link href="/shops?filter=new"
          className={`px-3 py-1.5 rounded-full text-sm border ${filter === 'new' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'}`}>
          🆕 NEW OPEN
        </Link>
        <Link href="/shops?filter=child"
          className={`px-3 py-1.5 rounded-full text-sm border ${filter === 'child' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
          👶 子連れOK
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <Link key={cat}
            href={cat === 'すべて' ? '/shops' : `/shops?category=${cat}`}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border ${(category === cat || (cat === 'すべて' && !category && !filter)) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
            {cat}
          </Link>
        ))}
      </div>

      {shops && shops.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {shops.map((shop: Shop) => (
            <Link key={shop.id} href={`/shops/${shop.id}`}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{shop.name}</span>
                  {shop.is_new_open && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">NEW OPEN</span>}
                </div>
                <div className="text-gray-500 text-sm mb-2">{shop.category} · {shop.address}</div>
                <div className="flex flex-wrap gap-1">
                  {shop.child_friendly && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">👶 子連れOK</span>}
                  {shop.stroller_ok && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">ベビーカーOK</span>}
                  {shop.kids_menu && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">キッズメニュー</span>}
                  {shop.nursing_room && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">授乳室</span>}
                </div>
              </div>
              <span className="text-gray-400 ml-2">›</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p>該当するお店が見つかりません</p>
        </div>
      )}
    </div>
  )
}
