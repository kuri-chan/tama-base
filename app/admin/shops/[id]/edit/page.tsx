'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'

const CATEGORIES = ['カフェ', '飲食', 'スイーツ', '小売', 'サービス', '美容', '医療', 'その他']

export default function EditShopPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '', address: '', category: 'カフェ', description: '',
    hours: '', phone: '', website: '',
    is_new_open: false, child_friendly: false,
    stroller_ok: false, kids_menu: false,
    nursing_room: false, diaper_change: false, kids_space: false,
    images: [] as string[],
  })

  useEffect(() => {
    supabase.from('shops').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({
        name: data.name || '',
        address: data.address || '',
        category: data.category || 'カフェ',
        description: data.description || '',
        hours: data.hours || '',
        phone: data.phone || '',
        website: data.website || '',
        is_new_open: data.is_new_open || false,
        child_friendly: data.child_friendly || false,
        stroller_ok: data.stroller_ok || false,
        kids_menu: data.kids_menu || false,
        nursing_room: data.nursing_room || false,
        diaper_change: data.diaper_change || false,
        kids_space: data.kids_space || false,
        images: data.images || [],
      })
      setLoading(false)
    })
  }, [id])

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('shops').update({
      name: form.name, address: form.address, category: form.category,
      description: form.description, hours: form.hours,
      phone: form.phone || null, website: form.website || null,
      is_new_open: form.is_new_open, child_friendly: form.child_friendly,
      stroller_ok: form.stroller_ok, kids_menu: form.kids_menu,
      nursing_room: form.nursing_room, diaper_change: form.diaper_change,
      kids_space: form.kids_space, images: form.images,
    }).eq('id', id)
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">読み込み中...</div>
  )

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700">← 管理画面</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold">🏪 お店を編集</h1>
      </div>

      <div className="space-y-5 bg-white rounded-2xl border p-6 shadow-sm">

        {/* 写真アップロード（最上部に配置） */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📷 写真（最大5枚）
          </label>
          <ImageUploader
            folder="shops"
            existingImages={form.images}
            onImagesChange={(urls) => set('images', urls)}
          />
        </div>

        <hr className="border-gray-100" />

        {/* 基本情報 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">店名 *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">カテゴリ *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">住所 *</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">説明文</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">営業時間</label>
            <input value={form.hours} onChange={e => set('hours', e.target.value)}
              placeholder="10:00〜22:00"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">電話番号</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="044-xxx-xxxx"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">公式サイトURL</label>
          <input value={form.website} onChange={e => set('website', e.target.value)}
            placeholder="https://..."
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <hr className="border-gray-100" />

        {/* ステータス */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_new_open}
              onChange={e => set('is_new_open', e.target.checked)}
              className="w-4 h-4 rounded text-green-600" />
            <span className="text-sm font-medium text-gray-700">🆕 NEW OPENバッジを表示する</span>
          </label>
        </div>

        {/* 子連れ情報 */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">👶 子連れ情報</div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['child_friendly', '子連れOK'],
              ['stroller_ok', 'ベビーカー入店可'],
              ['kids_menu', 'キッズメニュー'],
              ['nursing_room', '授乳室あり'],
              ['diaper_change', 'おむつ替え台'],
              ['kids_space', 'キッズスペース'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer bg-blue-50 rounded-xl px-3 py-2">
                <input type="checkbox"
                  checked={form[key] as boolean}
                  onChange={e => set(key, e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600" />
                <span className="text-sm text-blue-800">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="mt-5 flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
            saved ? 'bg-green-600' : saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}>
          {saved ? '✅ 保存しました！' : saving ? '保存中...' : '💾 変更を保存する'}
        </button>
        <Link href={`/shops/${id}`}
          className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium">
          確認
        </Link>
      </div>
    </div>
  )
}
