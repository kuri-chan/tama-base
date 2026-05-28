'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

async function compressImage(file: File, maxSize = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) { height = Math.round(height * maxSize / width); width = maxSize }
        else { width = Math.round(width * maxSize / height); height = maxSize }
      }
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality)
    }
    img.src = url
  })
}

interface Props {
  targetType: 'shop' | 'park'
  targetId: string
  targetName: string
}

export default function UserPhotoUpload({ targetType, targetId, targetName }: Props) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [comment, setComment] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    try {
      const compressed = await compressImage(selectedFile)
      const path = `user-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error: upErr } = await supabase.storage
        .from('tama-base-images')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: false })
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from('tama-base-images').getPublicUrl(path)

      const { error: dbErr } = await supabase.from('user_photos').insert({
        target_type: targetType,
        target_id: targetId,
        image_url: publicUrl,
        comment: comment.trim() || null,
      })
      if (dbErr) throw dbErr

      setDone(true)
    } catch (err) {
      console.error(err)
      setError('投稿に失敗しました。もう一度お試しください。')
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setOpen(false); setDone(false); setError(null)
    setComment(''); setPreview(null); setSelectedFile(null)
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <div className="text-3xl mb-2">🙏</div>
        <p className="font-bold text-green-800 text-sm">投稿ありがとうございます！</p>
        <p className="text-green-600 text-xs mt-1.5">確認後に掲載されます（通常1〜2日）</p>
        <button onClick={reset}
          className="mt-3 text-xs text-green-600 font-medium underline">
          別の写真を投稿する
        </button>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 font-medium hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        写真を投稿する
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-800 text-sm">📷 写真を投稿</h4>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
          閉じる
        </button>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        <span className="font-semibold text-gray-700">{targetName}</span>の写真を投稿できます。<br />
        確認後に掲載されます（不適切な写真は掲載されません）。
      </p>

      {/* Photo area */}
      {!preview ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-all"
        >
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-gray-400 font-medium">タップして写真を選択</span>
        </button>
      ) : (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="プレビュー" className="w-full aspect-video object-cover rounded-xl" />
          <button
            type="button"
            onClick={() => { setPreview(null); setSelectedFile(null) }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black transition-colors shadow">
            ✕
          </button>
        </div>
      )}

      {/* Comment */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="コメント（任意）：例「夏にきました！遊具が充実していました」"
        rows={2}
        maxLength={200}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors"
      />

      {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedFile || uploading}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          !selectedFile || uploading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-700 text-white hover:bg-green-800 shadow-sm'
        }`}
      >
        {uploading ? '投稿中...' : '投稿する'}
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}
