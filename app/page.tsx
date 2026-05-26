import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Shop, Park } from '@/types'

export default async function HomePage() {
  const { data: newShops } = await supabase
    .from('shops').select('*')
    .eq('is_new_open', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const { data: childShops } = await supabase
    .from('shops').select('*')
    .eq('child_friendly', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const { data: parks } = await supabase
    .from('parks').select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-green-700 text-white rounded-2xl p-8 mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">川崎市多摩区の地域情報</h1>
        <p className="text-green-100 mb-6">お店・公園・子育て情報をまとめてチェック</p>
        <div className="flex justify-center gap-3">
          <Link href="/shops"
            className="bg-white text-green-700 px-5 py-2 rounded-full font-medium hover:bg-green-50">
            お店を探す
          </Link>
          <Link href="/parks"
            className="bg-green-600 text-white px-5 py-2 rounded-full font-medium border border-white hover:bg-green-500">
            公園を探す
          </Link>
        </div>
      </div>

      {/* NEW OPEN */}
      {newShops && newShops.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🆕 新規オープン</h2>
            <Link href="/shops?filter=new" className="text-green-600 text-sm hover:underline">もっと見る</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newShops.map((shop: Shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm">{shop.name}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full shrink-0 ml-1">NEW</span>
                </div>
                <span className="text-gray-500 text-xs">{shop.category}</span>
                {shop.child_friendly && <div className="text-xs text-blue-600 mt-1">👶 子連れOK</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 子連れOK */}
      {childShops && childShops.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">👶 子連れで行けるお店</h2>
            <Link href="/shops?filter=child" className="text-green-600 text-sm hover:underline">もっと見る</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {childShops.map((shop: Shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="font-medium text-sm mb-1">{shop.name}</div>
                <div className="text-gray-500 text-xs">{shop.category}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {shop.stroller_ok && <span className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded">ベビーカーOK</span>}
                  {shop.kids_menu && <span className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded">キッズメニュー</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 公園 */}
      {parks && parks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🏞️ 公園情報</h2>
            <Link href="/parks" className="text-green-600 text-sm hover:underline">もっと見る</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {parks.map((park: Park) => (
              <Link key={park.id} href={`/parks/${park.id}`}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="font-medium text-sm mb-1">{park.name}</div>
                <div className="text-gray-500 text-xs">{park.address}</div>
                <div className="flex gap-2 mt-2 text-xs text-gray-500">
                  {park.has_toilet && <span>🚻</span>}
                  {park.has_parking && <span>🅿️</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(!newShops?.length && !childShops?.length && !parks?.length) && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">情報を準備中です 🌱</p>
          <p className="text-sm mt-2">もうしばらくお待ちください</p>
        </div>
      )}
    </div>
  )
}
