'use client'
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Shop, Park } from '@/types'
import CategoryVisual from '@/components/CategoryVisual'

type ResultType = 'all' | 'shop' | 'park'

// 住所から多摩区の町名を抽出
function extractArea(address: string | null): string | null {
  if (!address) return null
  const m = address.match(/多摩区([一-龯ぁ-んァ-ヶ]+?)([0-9０-９]|$)/)
  return m ? m[1] : null
}

// 町名を駅・エリアでグルーピング
function areaGroup(town: string): string {
  if (town.startsWith('菅')) return '稲田堤・菅エリア'
  if (['登戸', '枡形', '宿河原', '堰'].includes(town)) return '登戸・向ヶ丘遊園エリア'
  if (town === '中野島') return '中野島エリア'
  if (['東生田', '西生田', '南生田', '生田'].includes(town)) return '生田エリア'
  if (['東三田', '三田', '寺尾台'].includes(town)) return '三田エリア'
  if (town.startsWith('長尾')) return '長尾エリア'
  if (['上麻生', '百合丘'].includes(town)) return '百合ヶ丘エリア'
  return 'その他エリア'
}

function SearchInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [shops, setShops] = useState<Shop[]>([])
  const [parks, setParks] = useState<Park[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [type, setType] = useState<ResultType>((searchParams.get('type') as ResultType) || 'all')
  const [area, setArea] = useState<string | null>(searchParams.get('area'))

  useEffect(() => {
    Promise.all([
      supabase.from('shops').select('*'),
      supabase.from('parks').select('*'),
    ]).then(([s, p]) => {
      setShops(s.data || [])
      setParks(p.data || [])
      setLoading(false)
    })
  }, [])

  // データから利用可能なエリアグループを集計
  const areaGroups = useMemo(() => {
    const counts: Record<string, number> = {}
    const tag = (addr: string | null) => {
      const town = extractArea(addr)
      if (!town) return
      const g = areaGroup(town)
      counts[g] = (counts[g] || 0) + 1
    }
    shops.forEach(s => tag(s.address))
    parks.forEach(p => tag(p.address))
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([g]) => g)
  }, [shops, parks])

  const kw = q.trim().toLowerCase()
  const matchText = (fields: (string | null | undefined)[], tags?: string[] | null) => {
    if (!kw) return true
    const hay = [...fields, ...(tags || [])].filter(Boolean).join(' ').toLowerCase()
    return hay.includes(kw)
  }
  const matchArea = (addr: string | null) => {
    if (!area) return true
    const town = extractArea(addr)
    return town ? areaGroup(town) === area : false
  }

  const shopResults = useMemo(() =>
    (type === 'park') ? [] :
    shops.filter(s => matchText([s.name, s.description, s.address, s.category], s.tags) && matchArea(s.address)),
    [shops, kw, type, area])

  const parkResults = useMemo(() =>
    (type === 'shop') ? [] :
    parks.filter(p => matchText([p.name, p.description, p.address], [...(p.tags || []), ...(p.equipment || [])]) && matchArea(p.address)),
    [parks, kw, type, area])

  const total = shopResults.length + parkResults.length

  // URLにクエリを反映（共有可能に）
  useEffect(() => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (type !== 'all') params.set('type', type)
    if (area) params.set('area', area)
    const qs = params.toString()
    router.replace(qs ? `/search?${qs}` : '/search', { scroll: false })
  }, [q, type, area, router])

  return (
    <div className="pb-24 min-h-dvh">
      {/* 検索ヘッダー */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="relative mb-3">
            <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="お店・公園・キーワードで検索"
              className="w-full bg-gray-100 rounded-full pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
            {q && (
              <button onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-400">
                ✕
              </button>
            )}
          </div>

          {/* タイプ切替 */}
          <div className="flex gap-2 mb-2.5">
            {([['all', 'すべて'], ['shop', '🏪 お店'], ['park', '🌳 公園']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setType(val)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  type === val ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* エリアフィルター */}
          {areaGroups.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setArea(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 transition-all ${
                  !area ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'
                }`}>
                全エリア
              </button>
              {areaGroups.map(g => (
                <button key={g} onClick={() => setArea(area === g ? null : g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 transition-all ${
                    area === g ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'
                  }`}>
                  📍 {g}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 結果 */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="text-center text-gray-400 py-20 text-sm">読み込み中...</div>
        ) : total === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium text-sm">
              {kw || area ? '該当する結果が見つかりません' : 'キーワードを入力してください'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{total}件の結果</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shopResults.map(shop => (
                <Link key={`s-${shop.id}`} href={`/shops/${shop.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
                  <div className="relative aspect-[3/2]">
                    {shop.images?.[0] ? (
                      <Image src={shop.images[0]} alt={shop.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:640px) 50vw, 33vw" />
                    ) : (
                      <CategoryVisual category={shop.category} name={shop.name} />
                    )}
                    {shop.is_new_open && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">NEW</span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm text-gray-900 line-clamp-1">{shop.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{shop.category}</div>
                  </div>
                </Link>
              ))}
              {parkResults.map(park => (
                <Link key={`p-${park.id}`} href={`/parks/${park.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100/80">
                  <div className="relative aspect-[3/2]">
                    {park.images?.[0] ? (
                      <Image src={park.images[0]} alt={park.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:640px) 50vw, 33vw" />
                    ) : (
                      <CategoryVisual category="公園" name={park.name} />
                    )}
                    {park.age_range && (
                      <span className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">{park.age_range}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm text-gray-900 line-clamp-1">{park.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">公園</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 py-20 text-sm">読み込み中...</div>}>
      <SearchInner />
    </Suspense>
  )
}
