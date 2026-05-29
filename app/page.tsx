export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Shop, Park } from '@/types'
import CategoryVisual from '@/components/CategoryVisual'

const CATEGORIES = [
  { label: 'カフェ', icon: '☕', value: 'カフェ', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { label: '飲食', icon: '🍽️', value: '飲食', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  { label: 'スイーツ', icon: '🍰', value: 'スイーツ', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  { label: '小売', icon: '🛍️', value: '小売', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { label: '美容', icon: '✂️', value: '美容', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { label: 'その他', icon: '📍', value: 'その他', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
]

export const CATEGORY_GRADIENT: Record<string, string> = {
  カフェ: 'from-amber-400 to-orange-400',
  飲食: 'from-red-400 to-orange-400',
  スイーツ: 'from-pink-400 to-fuchsia-400',
  小売: 'from-blue-400 to-sky-400',
  美容: 'from-purple-400 to-violet-400',
  サービス: 'from-indigo-400 to-blue-400',
  医療: 'from-teal-400 to-emerald-400',
  その他: 'from-gray-400 to-slate-400',
}

export const CATEGORY_ICON: Record<string, string> = {
  カフェ: '☕', 飲食: '🍽️', スイーツ: '🍰', 小売: '🛍️',
  美容: '✂️', サービス: '🔧', 医療: '🏥', その他: '📍',
}

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shops/${shop.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
      <div className="relative aspect-[3/2]">
        {shop.images?.[0] ? (
          <Image src={shop.images[0]} alt={shop.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="220px" />
        ) : (
          <CategoryVisual category={shop.category} name={shop.name} />
        )}
        {shop.images?.[0] && <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />}
        {shop.is_new_open && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold tracking-wide">
            NEW
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="font-bold text-sm text-gray-900 line-clamp-1">{shop.name}</div>
        <div className="text-[11px] text-gray-400 mt-0.5 mb-2">{shop.category}</div>
        <div className="flex flex-wrap gap-1">
          {shop.stroller_ok && (
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">BC入店可</span>
          )}
          {shop.kids_menu && (
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">キッズメニュー</span>
          )}
          {shop.nursing_room && (
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">授乳室</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function ParkCard({ park }: { park: Park }) {
  return (
    <Link href={`/parks/${park.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
      <div className="relative aspect-[3/2]">
        {park.images?.[0] ? (
          <Image src={park.images[0]} alt={park.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="220px" />
        ) : (
          <CategoryVisual category="公園" name={park.name} />
        )}
        {park.age_range && (
          <span className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {park.age_range}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{park.name}</div>
        <div className="flex flex-wrap gap-2 text-[10px] text-gray-400">
          {park.has_toilet && <span>🚻 トイレ</span>}
          {park.has_parking && <span>🅿️ 駐車場</span>}
          {park.has_bench && <span>🪑 ベンチ</span>}
          {park.has_shade && <span>🌳 日陰</span>}
        </div>
        {park.equipment && park.equipment.length > 0 && (
          <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">
            {park.equipment.slice(0, 3).join(' · ')}
            {park.equipment.length > 3 && ` +${park.equipment.length - 3}`}
          </div>
        )}
      </div>
    </Link>
  )
}

function SectionHeader({ title, sub, href, linkLabel }: { title: string; sub: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h2 className="text-[17px] font-black text-gray-900 leading-tight">{title}</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
      </div>
      <Link href={href} className="text-green-700 text-xs font-bold pb-0.5">
        すべて見る →
      </Link>
    </div>
  )
}

export default async function HomePage() {
  const [
    { data: newShops },
    { data: childShops },
    { data: parks },
    { count: shopCount },
    { count: parkCount },
    { count: newCount },
  ] = await Promise.all([
    supabase.from('shops').select('*').eq('is_new_open', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('shops').select('*').eq('child_friendly', true).order('created_at', { ascending: false }).limit(6),
    supabase.from('parks').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('shops').select('*', { count: 'exact', head: true }),
    supabase.from('parks').select('*', { count: 'exact', head: true }),
    supabase.from('shops').select('*', { count: 'exact', head: true }).eq('is_new_open', true),
  ])

  return (
    <div className="pb-24">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white px-4 pt-10 pb-12">
        {/* 多摩川をイメージした河川風景（背景写真） */}
        <Image src="/hero-river.jpg" alt="" fill priority sizes="100vw"
          className="object-cover object-center" />
        {/* 可読性のためのオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/85 via-green-900/60 to-green-950/55" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-green-300 text-[10px] font-medium tracking-[0.2em] uppercase mb-2">
              Kawasaki · Tama Ward
            </p>
            <h1 className="font-black text-[32px] leading-tight tracking-tight mb-1.5">TAMA BASE</h1>
            <p className="text-green-200 text-sm">川崎市多摩区の地域情報プラットフォーム</p>
          </div>

          {/* 検索バー */}
          <Link href="/search"
            className="flex items-center gap-2.5 bg-white rounded-full px-4 py-3 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-400 text-sm">お店・公園・エリアで検索</span>
          </Link>

          {/* Stats */}
          <div className="flex gap-2.5 mb-7">
            {[
              { value: shopCount ?? 0, label: '登録店舗' },
              { value: newCount ?? 0, label: 'NEW OPEN' },
              { value: parkCount ?? 0, label: '公園情報' },
            ].map(stat => (
              <div key={stat.label}
                className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 text-center border border-white/15">
                <div className="text-2xl font-black tabular-nums">{stat.value}</div>
                <div className="text-green-200 text-[10px] mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-2.5">
            <Link href="/shops"
              className="flex-1 bg-white text-green-800 text-center py-3 rounded-2xl font-bold text-sm hover:bg-green-50 transition-colors shadow-sm">
              お店を探す
            </Link>
            <Link href="/parks"
              className="flex-1 bg-green-600/50 text-white text-center py-3 rounded-2xl font-bold text-sm border border-white/25 hover:bg-green-600/70 transition-colors">
              公園を探す
            </Link>
          </div>
        </div>
      </section>

      {/* ===== カテゴリ ===== */}
      <section className="max-w-4xl mx-auto px-4 pt-5 pb-1">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">カテゴリから探す</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.value}
              href={`/shops?category=${cat.value}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap shrink-0
                ${cat.bg} ${cat.text} ${cat.border} hover:shadow-sm transition-all`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-sm font-semibold">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== NEW OPEN ===== */}
      {newShops && newShops.length > 0 && (
        <section className="pt-6">
          <div className="max-w-4xl mx-auto px-4 mb-3">
            <SectionHeader
              title="NEW OPEN"
              sub="最近オープンしたお店"
              href="/shops?filter=new"
              linkLabel="すべて見る"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide snap-x snap-mandatory">
            {newShops.map((shop: Shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow shrink-0 w-44 snap-start border border-gray-100/80">
                <div className="relative aspect-[4/3]">
                  {shop.images?.[0] ? (
                    <Image src={shop.images[0]} alt={shop.name} fill className="object-cover" sizes="176px" />
                  ) : (
                    <CategoryVisual category={shop.category} name={shop.name} />
                  )}
                  {shop.images?.[0] && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    NEW
                  </span>
                  {shop.child_friendly && (
                    <span className="absolute bottom-2 right-2 bg-white/90 text-[10px] text-blue-600 font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      子連れOK
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="font-bold text-xs text-gray-900 line-clamp-2 leading-snug mb-0.5">{shop.name}</div>
                  <div className="text-[10px] text-gray-400">{shop.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 子連れOK ===== */}
      {childShops && childShops.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pt-6">
          <SectionHeader
            title="子連れで行けるお店"
            sub="ベビーカーOK · キッズメニュー · 授乳室あり"
            href="/shops?filter=child"
            linkLabel="すべて見る"
          />
          <div className="grid grid-cols-2 gap-3">
            {childShops.slice(0, 4).map((shop: Shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>
      )}

      {/* ===== 公園 ===== */}
      {parks && parks.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pt-6">
          <SectionHeader
            title="近くの公園"
            sub="遊具 · 設備 · 年齢対象"
            href="/parks"
            linkLabel="すべて見る"
          />
          <div className="grid grid-cols-2 gap-3">
            {parks.slice(0, 4).map((park: Park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        </section>
      )}

      {/* ===== MAP CTA ===== */}
      <section className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/map"
          className="block bg-gradient-to-br from-green-800 to-emerald-700 text-white rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5 relative z-10">
            <p className="text-[10px] text-green-300 font-bold uppercase tracking-widest mb-1.5">Area Map</p>
            <div className="font-black text-xl mb-1">地図で探す</div>
            <div className="text-green-100 text-sm">お店と公園の場所を一目で確認</div>
          </div>
          <div className="absolute right-5 inset-y-0 flex items-center opacity-20">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
        </Link>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 pt-8 pb-4 text-center">
        <p className="text-[11px] text-gray-400">© 2025 TAMA BASE — 川崎市多摩区の地域情報</p>
      </footer>

    </div>
  )
}
