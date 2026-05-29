import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import UserPhotoUpload from '@/components/UserPhotoUpload'
import FavoriteButton from '@/components/FavoriteButton'
import { CategoryGlyph } from '@/components/CategoryVisual'

const CATEGORY_STYLE: Record<string, { gradient: string; icon: string; textColor: string }> = {
  カフェ:    { gradient: 'from-amber-500 via-orange-400 to-yellow-400',   icon: '☕', textColor: 'text-amber-900' },
  飲食:      { gradient: 'from-red-500 via-orange-500 to-amber-400',      icon: '🍽️', textColor: 'text-red-900' },
  スイーツ:  { gradient: 'from-pink-500 via-rose-400 to-fuchsia-400',     icon: '🍰', textColor: 'text-pink-900' },
  小売:      { gradient: 'from-blue-500 via-sky-400 to-cyan-400',         icon: '🛍️', textColor: 'text-blue-900' },
  美容:      { gradient: 'from-purple-500 via-violet-400 to-pink-400',    icon: '✂️', textColor: 'text-purple-900' },
  医療:      { gradient: 'from-teal-500 via-emerald-400 to-green-400',    icon: '🏥', textColor: 'text-teal-900' },
  サービス:  { gradient: 'from-indigo-500 via-blue-400 to-sky-400',       icon: '🔧', textColor: 'text-indigo-900' },
  その他:    { gradient: 'from-slate-500 via-gray-400 to-zinc-400',       icon: '📍', textColor: 'text-slate-900' },
}
const DEFAULT_STYLE = { gradient: 'from-green-600 via-emerald-500 to-teal-400', icon: '🏪', textColor: 'text-green-900' }

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: shop } = await supabase.from('shops').select('*').eq('id', id).single()
  if (!shop) notFound()

  const style = CATEGORY_STYLE[shop.category] || DEFAULT_STYLE
  const heroPhoto = shop.images?.[0] || null
  const restPhotos: string[] = (shop.images || []).slice(1, 5)

  return (
    <div className="max-w-2xl mx-auto pb-10">

      {/* ビジュアルヘッダー */}
      <div className="relative px-4 pt-12 pb-9 min-h-[210px] flex flex-col justify-end overflow-hidden">
        {heroPhoto ? (
          <>
            <Image src={heroPhoto} alt={shop.name} fill priority
              className="object-cover" sizes="(max-width:672px) 100vw, 672px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
            <CategoryGlyph category={shop.category} strokeWidth={1}
              className="absolute -right-8 -bottom-10 w-56 h-56 text-white/20" />
          </>
        )}

        <Link href="/shops"
          className="absolute top-4 left-4 z-10 bg-black/25 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full hover:bg-black/40 transition-colors">
          ← 一覧に戻る
        </Link>
        {shop.is_new_open && (
          <span className="absolute top-4 right-4 z-10 bg-white text-red-600 text-xs font-black px-3 py-1.5 rounded-full shadow-md">
            NEW OPEN
          </span>
        )}

        <div className="relative z-10">
          {!heroPhoto && (
            <CategoryGlyph category={shop.category} strokeWidth={1.6} className="w-9 h-9 text-white/90 mb-2" />
          )}
          <div className="text-white/85 text-sm font-medium mb-1">{shop.category}</div>
          <h1 className="text-white text-2xl font-black leading-tight drop-shadow-md">
            {shop.name}
          </h1>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="px-4 -mt-4">

        {/* サブ写真ギャラリー（ヒーロー以外の写真） */}
        {restPhotos.length > 0 && (
          <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(restPhotos.length, 4)}, 1fr)` }}>
            {restPhotos.map((url: string, i: number) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image src={url} alt={`${shop.name} 写真${i + 2}`} fill className="object-cover" sizes="150px" />
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">

          {/* 基本情報 */}
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-gray-400 shrink-0 w-8 text-base">📍</span>
              <span className="text-gray-700 leading-snug">{shop.address}</span>
            </div>
            {shop.hours && (
              <div className="flex gap-3">
                <span className="text-gray-400 shrink-0 w-8 text-base">🕐</span>
                <span className="text-gray-700">{shop.hours}</span>
              </div>
            )}
            {shop.phone && (
              <div className="flex gap-3">
                <span className="text-gray-400 shrink-0 w-8 text-base">📞</span>
                <a href={`tel:${shop.phone}`} className="text-green-600 hover:underline font-medium">
                  {shop.phone}
                </a>
              </div>
            )}
            {shop.website && (
              <div className="flex gap-3">
                <span className="text-gray-400 shrink-0 w-8 text-base">🌐</span>
                <a href={shop.website} target="_blank" rel="noopener noreferrer"
                  className="text-green-600 hover:underline truncate text-sm">
                  公式サイトを見る
                </a>
              </div>
            )}
          </div>

          {/* 説明 */}
          {shop.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed">{shop.description}</p>
            </div>
          )}
        </div>

        {/* 子連れ情報 */}
        {shop.child_friendly && (
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4 mb-4 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-xl">👶</span> 子連れ情報
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">子連れOK</span>
              {shop.stroller_ok && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">🚼 ベビーカー入店可</span>
              )}
              {shop.kids_menu && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">🍱 キッズメニュー</span>
              )}
              {shop.nursing_room && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">🤱 授乳室あり</span>
              )}
              {shop.diaper_change && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">🧷 おむつ替え台</span>
              )}
              {shop.kids_space && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">🧸 キッズスペース</span>
              )}
            </div>
          </div>
        )}

        {/* タグ */}
        {shop.tags && shop.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {shop.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* アクション */}
        <div className="flex gap-2.5">
          <FavoriteButton type="shop" id={shop.id} />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center text-center bg-gradient-to-r ${style.gradient} text-white py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md`}>
            📍 Google Mapsで経路を確認
          </a>
        </div>

        {/* ユーザー写真投稿 */}
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">みんなの写真</p>
          <UserPhotoUpload targetType="shop" targetId={shop.id} targetName={shop.name} />
        </div>

        {/* ボトムナビ分の余白 */}
        <div className="pb-4" />
      </div>
    </div>
  )
}
