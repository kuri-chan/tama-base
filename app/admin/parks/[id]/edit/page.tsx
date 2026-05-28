'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'

export default function EditParkPage() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '', address: '', description: '', age_range: '',
    has_toilet: false, has_parking: false, has_bench: false, has_shade: false,
    equipment: [] as string[],
    images: [] as string[],
  })
  const [equipmentInput, setEquipmentInput] = useState('')

  useEffect(() => {
    supabase.from('parks').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({
        name: data.name || '',
        address: data.address || '',
        description: data.description || '',
        age_range: data.age_range || '',
        has_toilet: data.has_toilet || false,
        has_parking: data.has_parking || false,
        has_bench: data.has_bench || false,
        has_shade: data.has_shade || false,
        equipment: data.equipment || [],
        images: data.images || [],
      })
      setLoading(false)
    })
  }, [id])

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const addEquipment = () => {
    const item = equipmentInput.trim()
    if (item && !form.equipment.includes(item)) {
      set('equipment', [...form.equipment, item])
      setEquipmentInput('')
    }
  }

  const removeEquipment = (item: string) =>
    set('equipment', form.equipment.filter(e => e !== item))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('parks').update({
      name: form.name, address: form.address, description: form.description,
      age_range: form.age_range, has_toilet: form.has_toilet,
      has_parking: form.has_parking, has_bench: form.has_bench,
      has_shade: form.has_shade, equipment: form.equipment,
      images: form.images,
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
        <h1 className="text-xl font-bold">🏞️ 公園を編集</h1>
      </div>

      <div className="space-y-5 bg-white rounded-2xl border p-6 shadow-sm">

        {/* 写真アップロード */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📷 写真（最大5枚）
          </label>
          <ImageUploader
            folder="parks"
            existingImages={form.images}
            onImagesChange={(urls) => set('images', urls)}
          />
        </div>

        <hr className="border-gray-100" />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">公園名 *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">対象年齢</label>
          <input value={form.age_range} onChange={e => set('age_range', e.target.value)}
            placeholder="例：全年齢 / 2歳〜小学生"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <hr className="border-gray-100" />

        {/* 設備 */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">🏗️ 設備</div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['has_toilet', '🚻 トイレあり'],
              ['has_parking', '🅿️ 駐車場あり'],
              ['has_bench', '🪑 ベンチあり'],
              ['has_shade', '🌳 日陰あり'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer bg-green-50 rounded-xl px-3 py-2">
                <input type="checkbox"
                  checked={form[key] as boolean}
                  onChange={e => set(key, e.target.checked)}
                  className="w-4 h-4 rounded text-green-600" />
                <span className="text-sm text-green-800">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 遊具 */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">🎠 遊具・設備</div>
          <div className="flex gap-2 mb-2">
            <input
              value={equipmentInput}
              onChange={e => setEquipmentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
              placeholder="例：すべり台、ブランコ、砂場"
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button type="button" onClick={addEquipment}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.equipment.map(item => (
              <span key={item}
                className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                {item}
                <button type="button" onClick={() => removeEquipment(item)}
                  className="text-yellow-600 hover:text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
            saved ? 'bg-green-600' : saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}>
          {saved ? '✅ 保存しました！' : saving ? '保存中...' : '💾 変更を保存する'}
        </button>
        <Link href={`/parks/${id}`}
          className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium">
          確認
        </Link>
      </div>
    </div>
  )
}
