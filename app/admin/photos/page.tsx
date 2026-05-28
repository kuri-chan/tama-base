'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface UserPhoto {
  id: string
  created_at: string
  target_type: 'shop' | 'park'
  target_id: string
  image_url: string
  comment: string | null
  status: string
  target_name?: string
}

export default function PhotoModerationPage() {
  const [photos, setPhotos] = useState<UserPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_photos')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setPhotos([])
      setLoading(false)
      return
    }

    // Fetch target names in parallel
    const enriched = await Promise.all(data.map(async (photo) => {
      const table = photo.target_type === 'shop' ? 'shops' : 'parks'
      const { data: target } = await supabase.from(table).select('name').eq('id', photo.target_id).single()
      return { ...photo, target_name: target?.name || '不明' }
    }))

    setPhotos(enriched)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const approve = async (photo: UserPhoto) => {
    setProcessing(photo.id)
    try {
      // 1. Update status
      await supabase.from('user_photos').update({ status: 'approved' }).eq('id', photo.id)
      // 2. Add image URL to the target's images array
      const table = photo.target_type === 'shop' ? 'shops' : 'parks'
      const { data: target } = await supabase.from(table).select('images').eq('id', photo.target_id).single()
      const currentImages: string[] = target?.images || []
      if (!currentImages.includes(photo.image_url)) {
        await supabase.from(table).update({
          images: [...currentImages, photo.image_url]
        }).eq('id', photo.target_id)
      }
      setPhotos(p => p.filter(x => x.id !== photo.id))
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(null)
    }
  }

  const reject = async (id: string) => {
    setProcessing(id)
    try {
      await supabase.from('user_photos').update({ status: 'rejected' }).eq('id', id)
      setPhotos(p => p.filter(x => x.id !== id))
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">← 管理画面</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold">📸 投稿写真の承認</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">読み込み中...</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border shadow-sm">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-gray-700 font-bold">未承認の写真はありません</p>
          <p className="text-gray-400 text-sm mt-1">すべての投稿を確認済みです</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-medium">
            {photos.length}件の写真が承認待ちです
          </p>
          {photos.map(photo => (
            <div key={photo.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-opacity ${
                processing === photo.id ? 'opacity-50 pointer-events-none' : ''
              }`}>
              {/* Photo */}
              <div className="relative aspect-video">
                <Image src={photo.image_url} alt="投稿写真" fill className="object-cover" sizes="672px" />
              </div>

              <div className="p-4">
                {/* Target info */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    photo.target_type === 'shop'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {photo.target_type === 'shop' ? '🏪 お店' : '🌳 公園'}
                  </span>
                  <Link
                    href={`/${photo.target_type === 'shop' ? 'shops' : 'parks'}/${photo.target_id}`}
                    target="_blank"
                    className="font-bold text-gray-900 text-sm hover:text-green-700 hover:underline">
                    {photo.target_name}
                  </Link>
                </div>

                {/* Comment */}
                {photo.comment && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-3 italic leading-relaxed">
                    &ldquo;{photo.comment}&rdquo;
                  </p>
                )}

                <p className="text-xs text-gray-400 mb-4">
                  投稿日: {new Date(photo.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(photo)}
                    className="flex-1 py-2.5 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition-colors shadow-sm">
                    ✅ 承認して掲載
                  </button>
                  <button
                    onClick={() => reject(photo.id)}
                    className="flex-1 py-2.5 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors border border-red-200">
                    ✕ 却下
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
