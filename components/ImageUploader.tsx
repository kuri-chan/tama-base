'use client'
import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Props {
  bucket?: string
  folder: string          // 'shops' | 'parks'
  existingImages?: string[]
  onImagesChange: (urls: string[]) => void
  maxImages?: number
}

// クライアントサイドで画像を圧縮（最大1200px, 品質85%）
async function compressImage(file: File, maxSize = 1200, quality = 0.85): Promise<Blob> {
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
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality)
    }
    img.src = url
  })
}

export default function ImageUploader({
  bucket = 'tama-base-images',
  folder,
  existingImages = [],
  onImagesChange,
  maxImages = 5,
}: Props) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!fileArray.length) return
    if (images.length + fileArray.length > maxImages) {
      setError(`最大${maxImages}枚まで追加できます`)
      return
    }
    setError(null)
    setUploading(true)
    setUploadProgress(0)

    const newUrls: string[] = []
    for (let i = 0; i < fileArray.length; i++) {
      setUploadProgress(Math.round((i / fileArray.length) * 90))
      const file = fileArray[i]
      const compressed = await compressImage(file)
      const ext = 'jpg'
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: false })
      if (upErr) { setError('アップロードに失敗しました: ' + upErr.message); continue }
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      newUrls.push(publicUrl)
    }

    setUploadProgress(100)
    const updated = [...images, ...newUrls]
    setImages(updated)
    onImagesChange(updated)
    setUploading(false)
    setTimeout(() => setUploadProgress(0), 1000)
  }, [images, bucket, folder, maxImages, onImagesChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  const removeImage = async (url: string) => {
    // Supabase Storage からも削除
    const path = url.split('/tama-base-images/')[1]
    if (path) await supabase.storage.from(bucket).remove([path])
    const updated = images.filter(u => u !== url)
    setImages(updated)
    onImagesChange(updated)
  }

  return (
    <div className="space-y-3">
      {/* 既存画像グリッド */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={url} alt={`写真${i + 1}`} fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  メイン
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* アップロードエリア */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? 'border-green-500 bg-green-50' :
            uploading ? 'border-gray-200 bg-gray-50 cursor-default' :
            'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }`}>
          {uploading ? (
            <div className="space-y-2">
              <div className="text-2xl animate-pulse">📤</div>
              <div className="text-sm text-gray-600">アップロード中...</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-3xl">📷</div>
              <div className="text-sm font-medium text-gray-700">
                写真をドラッグ＆ドロップ
              </div>
              <div className="text-xs text-gray-500">
                またはクリックして選択（残り{maxImages - images.length}枚）
              </div>
              <div className="text-xs text-gray-400">JPEG / PNG / WebP 対応</div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  )
}
