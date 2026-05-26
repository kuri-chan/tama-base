import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: shop } = await supabase.from('shops').select('*').eq('id', id).single()
  if (!shop) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/shops" className="text-green-600 text-sm hover:underline mb-4 block">← お店一覧に戻る</Link>

      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        {/* ヘッダー */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-1">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            {shop.is_new_open && (
              <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium">NEW OPEN</span>
            )}
          </div>
          <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{shop.category}</span>
        </div>

        {/* 基本情報 */}
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 shrink-0">📍 住所</span>
            <span>{shop.address}</span>
          </div>
          {shop.hours && (
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">🕐 営業時間</span>
              <span>{shop.hours}</span>
            </div>
          )}
          {shop.phone && (
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">📞 電話</span>
              <a href={`tel:${shop.phone}`} className="text-green-600 hover:underline">{shop.phone}</a>
            </div>
          )}
          {shop.website && (
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">🌐 Web</span>
              <a href={shop.website} target="_blank" className="text-green-600 hover:underline truncate">{shop.website}</a>
            </div>
          )}
        </div>

        {/* 説明 */}
        {shop.description && (
          <p className="text-gray-700 text-sm mb-6 leading-relaxed border-t pt-4">{shop.description}</p>
        )}

        {/* 子連れ情報 */}
        {shop.child_friendly && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-3">👶 子連れ情報</h3>
            <div className="flex flex-wrap gap-2">
              {shop.child_friendly && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">子連れOK</span>}
              {shop.stroller_ok && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">ベビーカー入店可</span>}
              {shop.kids_menu && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">キッズメニュー</span>}
              {shop.nursing_room && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">授乳室あり</span>}
              {shop.diaper_change && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">おむつ替え台</span>}
              {shop.kids_space && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">キッズスペース</span>}
            </div>
          </div>
        )}

        {/* Google Maps */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
          target="_blank"
          className="block w-full text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-medium">
          📍 Google Mapsで見る
        </a>
      </div>
    </div>
  )
}
