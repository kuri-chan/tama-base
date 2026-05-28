import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default async function AdminPage() {
  const { data: shops } = await supabase.from('shops').select('*').order('created_at', { ascending: false })
  const { data: parks } = await supabase.from('parks').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-2">🗺️ TAMA BASE 管理画面</h1>
      <p className="text-gray-500 text-sm mb-8">お店・公園の情報や写真を管理できます</p>

      {/* 統計 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-green-700 mb-1">登録店舗</h2>
          <p className="text-3xl font-black text-green-600">{shops?.length ?? 0}<span className="text-base font-normal ml-1">件</span></p>
          <Link href="/admin/shops/new"
            className="mt-3 block text-center bg-green-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-700">
            ＋ お店を追加
          </Link>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-blue-700 mb-1">登録公園</h2>
          <p className="text-3xl font-black text-blue-600">{parks?.length ?? 0}<span className="text-base font-normal ml-1">件</span></p>
          <Link href="/admin/parks/new"
            className="mt-3 block text-center bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
            ＋ 公園を追加
          </Link>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-purple-700 mb-1">写真登録済み</h2>
          <p className="text-3xl font-black text-purple-600">
            {[...(shops || []), ...(parks || [])].filter(x => x.images?.length > 0).length}
            <span className="text-base font-normal ml-1">件</span>
          </p>
          <Link href="/admin/photos"
            className="mt-3 block text-center bg-purple-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-700">
            📸 投稿写真を確認
          </Link>
        </div>
      </div>

      {/* お店リスト */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">🏪 お店一覧</h2>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {shops?.map((shop, i) => (
            <div key={shop.id}
              className={`flex items-center gap-3 p-3 ${i < (shops.length - 1) ? 'border-b border-gray-100' : ''}`}>
              {/* サムネイル */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                {shop.images?.[0] ? (
                  <Image src={shop.images[0]} alt={shop.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xl">
                    {shop.category === 'カフェ' ? '☕' : shop.category === '飲食' ? '🍽️' :
                     shop.category === 'スイーツ' ? '🍰' : shop.category === '小売' ? '🛍️' : '🏪'}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm truncate">{shop.name}</span>
                  {shop.is_new_open && (
                    <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full shrink-0">NEW</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{shop.category} · {shop.images?.length || 0}枚の写真</div>
              </div>

              <Link href={`/admin/shops/${shop.id}/edit`}
                className="shrink-0 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-green-100 hover:text-green-700 font-medium transition-colors">
                ✏️ 編集
              </Link>
            </div>
          ))}
          {(!shops || shops.length === 0) && (
            <p className="text-center py-8 text-gray-400">まだ登録されていません</p>
          )}
        </div>
      </div>

      {/* 公園リスト */}
      <div>
        <h2 className="text-lg font-bold mb-3">🏞️ 公園一覧</h2>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {parks?.map((park, i) => (
            <div key={park.id}
              className={`flex items-center gap-3 p-3 ${i < (parks.length - 1) ? 'border-b border-gray-100' : ''}`}>
              {/* サムネイル */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                {park.images?.[0] ? (
                  <Image src={park.images[0]} alt={park.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xl">🌳</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{park.name}</div>
                <div className="text-xs text-gray-400">{park.age_range || '全年齢'} · {park.images?.length || 0}枚の写真</div>
              </div>

              <Link href={`/admin/parks/${park.id}/edit`}
                className="shrink-0 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors">
                ✏️ 編集
              </Link>
            </div>
          ))}
          {(!parks || parks.length === 0) && (
            <p className="text-center py-8 text-gray-400">まだ登録されていません</p>
          )}
        </div>
      </div>
    </div>
  )
}
