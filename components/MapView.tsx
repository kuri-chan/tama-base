'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import { Shop, Park } from '@/types'
import 'leaflet/dist/leaflet.css'

// Leafletのデフォルトアイコン修正
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const parkIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

type Props = {
  shops: Shop[]
  parks: Park[]
}

export default function MapView({ shops, parks }: Props) {
  useEffect(() => {}, [])

  return (
    <MapContainer
      center={[35.6219, 139.5706]}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {shops.map(shop => (
        <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shopIcon}>
          <Popup>
            <div className="text-sm">
              <div className="font-bold mb-1">{shop.name}</div>
              <div className="text-gray-500 mb-1">{shop.category}</div>
              {shop.is_new_open && <div className="text-red-500 text-xs mb-1">🆕 NEW OPEN</div>}
              {shop.child_friendly && <div className="text-blue-500 text-xs mb-2">👶 子連れOK</div>}
              <Link href={`/shops/${shop.id}`} className="text-green-600 underline text-xs">
                詳細を見る →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {parks.map(park => (
        <Marker key={park.id} position={[park.lat, park.lng]} icon={parkIcon}>
          <Popup>
            <div className="text-sm">
              <div className="font-bold mb-1">{park.name}</div>
              <div className="text-gray-500 text-xs mb-1">{park.address}</div>
              <div className="flex gap-2 text-xs mb-2">
                {park.has_toilet && <span>🚻</span>}
                {park.has_parking && <span>🅿️</span>}
              </div>
              <Link href={`/parks/${park.id}`} className="text-green-600 underline text-xs">
                詳細を見る →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}