import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Park } from '@/types'

export default async function ParksPage() {
  const { data: parks } = await supabase
    .from('parks').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-5">🏞️ 公園一覧</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['トイレあり', '駐車場あり', '日陰あり'].map(tag => (
          <span key={tag} className="bg-white border text-gray-600 text-sm px-3 py-1.5 rounded-full">{tag}</span>
        ))}
      </div>

      {parks && parks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {parks.map((park: Park) => (
            <Link key={park.id} href={`/parks/${park.id}`}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium mb-1">{park.name}</div>
                <div className="text-gray-500 text-sm mb-2">{park.address}</div>
                {park.age_range && (
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full mr-1">{park.age_range}</span>
                )}
                <div className="flex gap-2 mt-2 text-sm">
                  {park.has_toilet && <span className="text-gray-500">🚻 トイレ</span>}
                  {park.has_parking && <span className="text-gray-500">🅿️ 駐車場</span>}
                  {park.has_bench && <span className="text-gray-500">🪑 ベンチ</span>}
                  {park.has_shade && <span className="text-gray-500">🌳 日陰</span>}
                </div>
                {park.equipment && park.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {park.equipment.map((item: string) => (
                      <span key={item} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-full">{item}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-gray-400 ml-2">›</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p>公園情報を準備中です 🌱</p>
        </div>
      )}
    </div>
  )
}
