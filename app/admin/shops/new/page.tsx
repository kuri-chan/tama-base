'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = ['飲食', 'カフェ', '小売', 'サービス', '美容', '医療', 'その他']

export default function NewShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', category: '飲食', address: '',
    lat: '', lng: '', hours: '', phone: '',
    website: '', description: '', is_new_open: false,
    open_date: '', child_friendly: false, stroller_ok: false,
    kids_menu: false, nursing_room: false, diaper_change: false, kids_space: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('shops').insert({
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      open_date: form.open_date || null,
    })
    if (error) { alert('エラー: ' + error.message); setLoading(false); return }
    alert('お店を追加しました！')
    router.push('/admin')
  }

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700">← 戻る</Link>
        <h1 className="text-2xl font-bold">お店を追加</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">店名 *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" placeholder="例：多摩カフェ" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">カテゴリ *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full border rounded-lg px-3 py-2">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">住所 *</label>
          <input required value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" placeholder="川崎市多摩区登戸..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">緯度 *</label>
            <input required type="number" step="any" value={form.lat}
              onChange={e => set('lat', e.target.value)}
              className="w-full border rounded-lg px-3 py-2" placeholder="35.6345" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">経度 *</label>
            <input required type="number" step="any" value={form.lng}
              onChange={e => set('lng', e.target.value)}
              className="w-full border rounded-lg px-3 py-2" placeholder="139.5765" />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          💡 緯度・経度は
          <a href="https://www.google.com/maps" target="_blank" className="text-blue-500 underline ml-1">
            Google Maps
          </a>
          で住所検索→URLの数値をコピー
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">営業時間</label>
          <input value={form.hours} onChange={e => set('hours', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" placeholder="11:00〜22:00（月曜定休）" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">電話番号</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" placeholder="044-XXX-XXXX" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ウェブサイト</label>
          <input type="url" value={form.website} onChange={e => set('website', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" rows={3} />
        </div>

        <div className="border rounded-xl p-4 space-y-3 bg-red-50">
          <h3 className="font-medium">🆕 新規オープン情報</h3>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_new_open}
              onChange={e => set('is_new_open', e.target.checked)} />
            <span>NEW OPENとして表示する</span>
          </label>
          {form.is_new_open && (
            <div>
              <label className="block text-sm font-medium mb-1">オープン日</label>
              <input type="date" value={form.open_date}
                onChange={e => set('open_date', e.target.value)}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
          )}
        </div>

        <div className="border rounded-xl p-4 space-y-3 bg-blue-50">
          <h3 className="font-medium">👶 子連れ情報</h3>
          {[
            ['child_friendly', '子連れOK'],
            ['stroller_ok', 'ベビーカー入店可'],
            ['kids_menu', 'キッズメニューあり'],
            ['nursing_room', '授乳室あり'],
            ['diaper_change', 'おむつ替え台あり'],
            ['kids_space', 'キッズスペースあり'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={e => set(key, e.target.checked)} />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50">
          {loading ? '追加中...' : '✓ お店を追加する'}
        </button>
      </form>
    </div>
  )
}
