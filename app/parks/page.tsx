export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Park } from '@/types'

export default async function ParksPage() {
  const { data: parks } = await supabase
    .from('parks').select('*').order('created_at', { ascending: false })

  return (
    <div className="pb-24">

      {/* Header */}
      <div className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-10 px-4 pt-4 pb-3">
        <div className="max-w-4xl mx-auto flex items-baseline justify-between">
          <h1 className="text-xl font-black text-gray-900">公園</h1>
          <span className="text-sm text-gray-400 tabular-nums">{parks?.length ?? 0}件</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {parks && parks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {parks.map((park: Park) => (
              <Link key={park.id} href={`/parks/${park.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
                <div className="relative aspect-[3/2]">
                  {park.images?.[0] ? (
                    <Image src={park.images[0]} alt={park.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 33vw" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-5xl drop-shadow">🌳</span>
                    </div>
                  )}
                  {park.age_range && (
                    <span className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {park.age_range}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{park.name}</div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-gray-400 mb-1">
                    {park.has_toilet && <span>🚻 トイレ</span>}
                    {park.has_parking && <span>🅿️ 駐車場</span>}
                    {park.has_bench && <span>🪑 ベンチ</span>}
                    {park.has_shade && <span>🌳 日陰</span>}
                  </div>
                  {park.equipment && park.equipment.length > 0 && (
                    <div className="text-[10px] text-gray-400 line-clamp-1">
                      {park.equipment.slice(0, 3).join(' · ')}
                      {park.equipment.length > 3 && ` +${park.equipment.length - 3}`}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-gray-500 font-medium text-sm">公園情報を準備中です</p>
          </div>
        )}
      </div>
    </div>
  )
}
