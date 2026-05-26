import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ParkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: park } = await supabase.from('parks').select('*').eq('id', id).single()
  if (!park) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/parks" className="text-green-600 text-sm hover:underline mb-4 block">← 公園一覧に戻る</Link>

      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">{park.name}</h1>
        {park.age_range && (
          <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full mb-4">{park.age_range}</span>
        )}

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 shrink-0">📍 住所</span>
            <span>{park.address}</span>
          </div>
        </div>

        {park.description && (
          <p className="text-gray-700 text-sm mb-6 leading-relaxed border-t pt-4">{park.description}</p>
        )}

        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <h3 className="font-medium text-green-800 mb-3">🏞️ 設備情報</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              [park.has_toilet, '🚻 トイレあり'],
              [park.has_parking, '🅿️ 駐車場あり'],
              [park.has_bench, '🪑 ベンチあり'],
              [park.has_shade, '🌳 日陰あり'],
            ].map(([has, label], i) => has ? (
              <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{label as string}</span>
            ) : null)}
          </div>
        </div>

        {park.equipment && park.equipment.length > 0 && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-3">🎠 遊具</h3>
            <div className="flex flex-wrap gap-2">
              {park.equipment.map((item: string) => (
                <span key={item} className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">{item}</span>
              ))}
            </div>
          </div>
        )}

        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(park.address)}`}
          target="_blank"
          className="block w-full text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-medium">
          📍 Google Mapsで見る
        </a>
      </div>
    </div>
  )
}