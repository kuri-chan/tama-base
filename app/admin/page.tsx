import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function AdminPage() {
  const { data: shops } = await supabase.from('shops').select('*').order('created_at', { ascending: false })
  const { data: parks } = await supabase.from('parks').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">🗺️ TAMA BASE 管理画面</h1>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">お店</h2>
          <p className="text-4xl font-bold text-green-600 mb-4">{shops?.length ?? 0}件</p>
          <Link href="/admin/shops/new"
            className="block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            ＋ お店を追加
          </Link>
        </div>
        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">公園</h2>
          <p className="text-4xl font-bold text-blue-600 mb-4">{parks?.length ?? 0}件</p>
          <Link href="/admin/parks/new"
            className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            ＋ 公園を追加
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">最近追加したお店</h2>
        <div className="space-y-2">
          {shops?.slice(0, 5).map(shop => (
            <div key={shop.id} className="border rounded-lg p-3 flex items-center gap-2">
              <span className="font-medium">{shop.name}</span>
              <span className="text-gray-500 text-sm">{shop.category}</span>
              {shop.is_new_open && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">NEW OPEN</span>
              )}
            </div>
          ))}
          {(!shops || shops.length === 0) && <p className="text-gray-400">まだ登録されていません</p>}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">最近追加した公園</h2>
        <div className="space-y-2">
          {parks?.slice(0, 5).map(park => (
            <div key={park.id} className="border rounded-lg p-3">
              <span className="font-medium">{park.name}</span>
            </div>
          ))}
          {(!parks || parks.length === 0) && <p className="text-gray-400">まだ登録されていません</p>}
        </div>
      </div>
    </div>
  )
}
