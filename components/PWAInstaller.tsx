'use client'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstaller() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Service Worker 登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // インストールプロンプト
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      // 1度表示したことがあれば再表示しない
      if (!localStorage.getItem('pwa-dismissed')) {
        setShowBanner(true)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-green-700 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
        <div className="text-2xl shrink-0">📲</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">ホーム画面に追加</div>
          <div className="text-green-200 text-xs">アプリとして使えます</div>
        </div>
        <button
          onClick={handleInstall}
          className="bg-white text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
          追加
        </button>
        <button onClick={handleDismiss} className="text-green-300 text-lg shrink-0">×</button>
      </div>
    </div>
  )
}
