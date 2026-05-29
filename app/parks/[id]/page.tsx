import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import UserPhotoUpload from '@/components/UserPhotoUpload'
import FavoriteButton from '@/components/FavoriteButton'
import { CategoryGlyph } from '@/components/CategoryVisual'

// 公園の特徴からビジュアルスタイルを決定
function getParkStyle(park: { equipment?: string[] | null; age_range?: string | null; has_shade?: boolean }) {
  const eq = park.equipment || []
  if (eq.some(e => e.includes('アスレチック') || e.includes('展望'))) {
    return { gradient: 'from-emerald-700 via-green-600 to-teal-500', icon: '🌲', mood: '自然・冒険' }
  }
  if (eq.some(e => e.includes('水') || e.includes('噴水') || e.includes('川') || e.includes('池'))) {
    return { gradient: 'from-cyan-500 via-sky-500 to-blue-500', icon: '💧', mood: '水遊び' }
  }
  if (eq.some(e => e.includes('すべり台') || e.includes('ブランコ') || e.includes('砂場'))) {
    return { gradient: 'from-yellow-400 via-orange-400 to-amber-400', icon: '🎠', mood: '遊具充実' }
  }
  if (park.age_range?.includes('未就学') || park.age_range?.includes('1歳')) {
    return { gradient: 'from-pink-400 via-rose-400 to-fuchsia-400', icon: '🧸', mood: '小さい子向け' }
  }
  return { gradient: 'from-green-600 via-emerald-500 to-teal-500', icon: '🏞️', mood: '自然豊か' }
}

const FACILITY_ITEMS = [
  { key: 'has_toilet',  icon: '🚻', label: 'トイレ' },
  { key: 'has_parking', icon: '🅿️', label: '駐車場' },
  { key: 'has_bench',   icon: '🪑', label: 'ベンチ' },
  { key: 'has_shade',   icon: '🌳', label: '日陰' },
] as const

export default async function ParkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: park } = await supabase.from('parks').select('*').eq('id', id).single()
  if (!park) notFound()

  const style = getParkStyle(park)

  const facilities = FACILITY_ITEMS.filter(f => park[f.key])
  const heroPhoto = park.images?.[0] || null
  const restPhotos: string[] = (park.images || []).slice(1, 5)

  return (
    <div className="max-w-2xl mx-auto pb-10">

      {/* ビジュアルヘッダー */}
      <div className="relative px-4 pt-12 pb-9 min-h-[210px] flex flex-col justify-end overflow-hidden">
        {heroPhoto ? (
          <>
            <Image src={heroPhoto} alt={park.name} fill priority
              className="object-cover" sizes="(max-width:672px) 100vw, 672px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
            <CategoryGlyph category="公園" strokeWidth={1}
              className="absolute -right-8 -bottom-10 w-56 h-56 text-white/20" />
          </>
        )}

        <Link href="/parks"
          className="absolute top-4 left-4 z-10 bg-black/25 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full hover:bg-black/40 transition-colors">
          ← 一覧に戻る
        </Link>

        <div className="relative z-10">
          {!heroPhoto && (
            <CategoryGlyph category="公園" strokeWidth={1.6} className="w-9 h-9 text-white/90 mb-2" />
          )}
          <div className="text-white/85 text-sm font-medium mb-1">{style.mood}</div>
          <h1 className="text-white text-2xl font-black leading-tight drop-shadow-md mb-2.5">
            {park.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            {park.age_range && (
              <span className="bg-white/25 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                👦 {park.age_range}
              </span>
            )}
            {facilities.length > 0 && (
              <span className="bg-white/25 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                設備 {facilities.length}種
              </span>
            )}
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="px-4 -mt-4">

        {/* サブ写真ギャラリー（ヒーロー以外の写真） */}
        {restPhotos.length > 0 && (
          <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(restPhotos.length, 4)}, 1fr)` }}>
            {restPhotos.map((url: string, i: number) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image src={url} alt={`${park.name} 写真${i + 2}`} fill className="object-cover" sizes="150px" />
              </div>
            ))}
          </div>
        )}

        {/* 基本情報 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <div className="flex gap-3 text-sm mb-4">
            <span className="text-gray-400 shrink-0 text-base">📍</span>
            <span className="text-gray-700 leading-snug">{park.address}</span>
          </div>

          {park.description && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed">{park.description}</p>
            </div>
          )}
        </div>

        {/* 設備情報 */}
        {facilities.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-4 border border-green-100">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🏗️</span> 設備・施設
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {facilities.map(f => (
                <div key={f.key}
                  className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-green-100">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-green-800 text-sm font-medium">{f.label}あり</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 遊具 */}
        {park.equipment && park.equipment.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 mb-4 border border-yellow-100">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🎡</span> 遊具・設備
            </h3>
            <div className="flex flex-wrap gap-2">
              {park.equipment.map((item: string) => (
                <span key={item}
                  className="bg-white border border-yellow-200 text-yellow-800 text-sm px-3 py-1.5 rounded-full font-medium shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* タグ */}
        {park.tags && park.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {park.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* アクション */}
        <div className="flex gap-2.5">
          <FavoriteButton type="park" id={park.id} />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(park.name + ' ' + park.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center text-center bg-gradient-to-r ${style.gradient} text-white py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md`}>
            📍 Google Mapsで経路を確認
          </a>
        </div>

        {/* ユーザー写真投稿 */}
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">みんなの写真</p>
          <UserPhotoUpload targetType="park" targetId={park.id} targetName={park.name} />
        </div>

        {/* ボトムナビ分の余白 */}
        <div className="pb-4" />
      </div>
    </div>
  )
}
