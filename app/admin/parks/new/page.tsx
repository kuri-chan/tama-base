'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const EQUIPMENT_OPTIONS = ['ブランコ', '滑り台', '砂場', '鉄棒', '雲梯', 'ジャングルジム', '水遊び場', 'バスケットゴール']
const AGE_RANGES = ['0〜2歳向け', '3〜5歳向け', '6歳以上向け', '全年齢']

type FormState = {
  name: string
  address: string
  lat: string
  lng: string
  description: string
  has_toilet: boolean
  has_parking: boolean
  has_bench: boolean
  has_shade: boolean
  equipment: string[]
  age_range: string
}

export default function NewParkPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: '', address: '', lat: '', lng: '',
    description: '', has_toilet: false, has_parking: false,
    has_bench: false, has_shade: false,
    equipment: [], age_range: '全年齢',
  })

  const toggleEquipment = (item: string) => {
    setForm(f => ({
      ...f,
      equipment: f.equipment.includes(item)
        ? f.equipment.filter(e => e !== item)
        : [...f.equipment, item]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('parks').insert({
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    })
    if (error) { alert('エラー: ' + error.message); setLoading(false); return }
    alert('公園を追加しました！')
    router.push('/admin')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700">← 戻る</Link>
        <h1 className="text-2xl font-bold">公園を追加</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">公園名 *</label>
          <input required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2" placeholder="例：登戸公園" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">住所 *</label>
          <input required value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2" placeholder="川崎市多摩区..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">緯度 *</label>
            <input required type="number" step="any" value={form.lat}
              onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2" placeholder="35.6345" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">経度 *</label>
            <input required type="number" step="any" value={form.lng}
              onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2" placeholder="139.5765" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2" rows={3} />
        </div>
        <div className="border rounded-xl p-4 space-y-3 bg-green-50">
          <h3 className="font-medium">🏞️ 設備情報</h3>
          {([
            ['has_toilet', 'トイレあり'],
            ['has_parking', '駐車場あり'],
            ['has_bench', 'ベンチあり'],
            ['has_shade', '日陰あり'],
          ] as [keyof FormState, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox"
                checked={form[key] as boolean}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <div className="border rounded-xl p-4 space-y-3 bg-yellow-50">
          <h3 className="font-medium">🎠 遊具</h3>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map(item => (
              <label key={item} className="flex items-center gap-2">
                <input type="checkbox"
                  checked={form.equipment.includes(item)}
                  onChange={() => toggleEquipment(item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">対象年齢</label>
          <select value={form.age_range}
            onChange={e => setForm(f => ({ ...f, age_range: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2">
            {AGE_RANGES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? '追加中...' : '✓ 公園を追加する'}
        </button>
      </form>
    </div>
  )
}