import type { JSX } from 'react'

// カテゴリごとの落ち着いた配色（ニュートラル寄り・ブランド調和）
const CATEGORY_THEME: Record<string, { from: string; to: string; ink: string }> = {
  カフェ:   { from: '#F5E6D3', to: '#E8D0B0', ink: '#9A6B3F' },
  飲食:     { from: '#F6DEDA', to: '#E8C0B8', ink: '#B05A48' },
  スイーツ: { from: '#F7DEEA', to: '#EFC2D8', ink: '#B85A86' },
  小売:     { from: '#DCEAF6', to: '#BFD6EE', ink: '#4A78A8' },
  美容:     { from: '#E7E0F4', to: '#D0C2EC', ink: '#7C5FB0' },
  サービス: { from: '#DEE4F4', to: '#C2CEEC', ink: '#5566A8' },
  医療:     { from: '#D8EEE8', to: '#B8E0D2', ink: '#3F8A74' },
  その他:   { from: '#E8E8EA', to: '#D2D2D6', ink: '#6B6B72' },
  公園:     { from: '#DEEEDC', to: '#BEE0BA', ink: '#4A8A48' },
}

// プラットフォーム非依存のモノクロ・ラインアイコン（emojiを使わない）
function iconPath(category: string): JSX.Element {
  switch (category) {
    case 'カフェ':
      return (
        <>
          <path d="M6 8h11v5a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V8Z" />
          <path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17" />
          <path d="M9 3c0 1-1 1-1 2s1 1 1 2M12.5 3c0 1-1 1-1 2s1 1 1 2" />
        </>
      )
    case '飲食':
      return (
        <>
          <path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9" />
        </>
      )
    case 'スイーツ':
      return (
        <>
          {/* ソフトクリーム：コーン＋2段のスクープ */}
          <path d="M8 11h8l-4 10-4-10Z" />
          <path d="M8.2 11a3.8 3.8 0 0 1 7.6 0" />
          <path d="M9.3 7.8a2.7 2.7 0 0 1 5.4 0" />
        </>
      )
    case '小売':
      return (
        <>
          <path d="M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2" />
        </>
      )
    case '美容':
      return (
        <>
          <circle cx="7" cy="7" r="2.5" /><circle cx="7" cy="17" r="2.5" />
          <path d="M9 8.5 20 19M9 15.5 20 5" />
        </>
      )
    case '医療':
      return (
        <>
          <path d="M12 5v14M5 12h14" /><rect x="4" y="4" width="16" height="16" rx="3" />
        </>
      )
    case 'サービス':
      return (
        <>
          <path d="M14.5 6.5a3.5 3.5 0 0 0-4.7 4.6L4 17l3 3 5.9-5.8a3.5 3.5 0 0 0 4.6-4.7l-2.2 2.2-2.1-.5-.5-2.1 2.3-2.3Z" />
        </>
      )
    case '公園':
      return (
        <>
          <path d="M12 3c-3 0-5 2.2-5 5 0 2.2 1.4 4 3.5 4.6L10 21h4l-.5-8.4C15.6 12 17 10.2 17 8c0-2.8-2-5-5-5Z" />
        </>
      )
    default: // その他
      return (
        <>
          <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
        </>
      )
  }
}

// アイコン単体（ヒーローなどで再利用）
export function CategoryGlyph({
  category,
  className = '',
  strokeWidth = 1.3,
}: { category: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {iconPath(category)}
    </svg>
  )
}

interface Props {
  category: string   // 'カフェ' | ... | '公園'
  name?: string
  className?: string
}

/**
 * 写真がない場合のフォールバック・ビジュアル。
 * 落ち着いたグラデーション＋モノクロのラインアイコンで、
 * 「未完成のテンプレート」感をなくし、デザインシステムらしい見た目にする。
 */
export default function CategoryVisual({ category, className = '' }: Props) {
  const theme = CATEGORY_THEME[category] || CATEGORY_THEME['その他']
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)` }}
    >
      {/* 大きく薄いアイコン（右下に寄せて余白を作る） */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.ink}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute -right-2 -bottom-3 w-[70%] h-[70%] opacity-[0.28]"
      >
        {iconPath(category)}
      </svg>
      {/* 小さくくっきりしたアイコン（左上） */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.ink}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 top-3 w-6 h-6 opacity-80"
      >
        {iconPath(category)}
      </svg>
    </div>
  )
}
