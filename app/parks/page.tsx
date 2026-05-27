export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Park } from '@/types'

export default async function ParksPage() {
  const { data: parks } = await supabase
    .from('parks').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* ヘッダー */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">🏞️ 公園一覧</h1>
        <p className="text-sm text-gray-500 mt-1">{parks?.length ?? 0}件の公園</p>
      </div>

      {/* 簡易フィルター（表示のみ） */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-full">🚻 トイレあり</span>
        <span className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-full">🅿️ 駐車場あり</span>
        <span className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-full">🌳 日陰あり</span>
        <span className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-full">🪑 ベンチあり</span>
      </div>

      {/* 公園リスト */}
      {parks && parks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {parks.map((park: Park) => (
            <Link key={park.id} href={`/parks/${park.id}`}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all hover:border-green-200">

              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="font-bold text-gray-900 mb-0.5">{park.name}</div>
                  <div className="text-gray-400 text-xs">{park.address}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {park.age_range && (
                    <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      {park.age_range}
                    </span>
                  )}
                  <span className="text-gray-300 text-xl">›</span>
                </div>
              </div>

              {/* 施設 */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                {park.has_toilet && <span className="flex items-center gap-0.5">🚻 トイレ</span>}
                {park.has_parking && <span className="flex items-center gap-0.5">🅿️ 駐車場</span>}
                {park.has_bench && <span className="flex items-center gap-0.5">🪑 ベンチ</span>}
                {park.has_shade && <span className="flex items-center gap-0.5">🌳 日陰</span>}
              </div>

              {/* 遊具 */}
              {park.equipment && park.equipment.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {park.equipment.map((item: string) => (
                    <span key={item}
                      className="bg-yellow-50 text-yellow-700 text-xs px-2.5 py-1 rounded-full border border-yellow-100">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-500 font-medium">公園情報を準備中です</p>
        </div>
      )}
    </div>
  )
}
