'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import { Shop, Park } from '@/types'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function MapPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [parks, setParks] = useState<Park[]>([])
  const [showShops, setShowShops] = useState(true)
  const [showParks, setShowParks] = useState(true)

  useEffect(() => {
    supabase.from('shops').select('*').then(({ data }) => data && setShops(data))
    supabase.from('parks').select('*').then(({ data }) => data && setParks(data))
  }, [])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px)' }}>
      {/* フィルター */}
      <div className="bg-white border-b px-4 py-2 flex gap-3">
        <button
          onClick={() => setShowShops(!showShops)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${showShops ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'}`}>
          🏪 お店（{shops.length}）
        </button>
        <button
          onClick={() => setShowParks(!showParks)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${showParks ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
          🏞️ 公園（{parks.length}）
        </button>
      </div>

      {/* 地図 */}
      <div className="flex-1">
        <MapView
          shops={showShops ? shops : []}
          parks={showParks ? parks : []}
        />
      </div>
    </div>
  )
}