/**
 * 多摩川をイメージしたヒーロー用の風景イラスト（自作SVG・著作権フリー）。
 * 川が奥（丹沢・富士山）の夕景へ向かって伸びる構図。
 * 風景はビューボックスの下半分に配置し、ヒーロー下部の余白に
 * きれいに収まるようにしている（テキストは上半分＝無地の緑に乗る）。
 */
export default function HeroScenery({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hs-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4F4EF" />
          <stop offset="100%" stopColor="#84C9C0" />
        </linearGradient>
        <linearGradient id="hs-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C7A4F" />
          <stop offset="100%" stopColor="#0E4A2E" />
        </linearGradient>
        <linearGradient id="hs-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3E9B73" />
          <stop offset="100%" stopColor="#2A805D" />
        </linearGradient>
        <radialGradient id="hs-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBEC" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FFF3CF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFF3CF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 夕日のグロー（川の消失点） */}
      <circle cx="720" cy="250" r="140" fill="url(#hs-sun)" />

      {/* 富士山（雪をかぶった遠景） */}
      <path d="M612 256 L712 182 L812 256 Z" fill="#9FCEC0" opacity="0.9" />
      <path d="M678 214 L712 182 L747 214 L731 226 L712 215 L693 226 Z" fill="#EAF7F2" opacity="0.95" />

      {/* 丹沢の稜線（遠景の山並み） */}
      <path d="M0 256 C 200 224, 380 252, 560 240 C 740 228, 900 258, 1100 238 C 1260 222, 1360 252, 1440 244 L1440 270 L0 270 Z"
        fill="#6FB59B" opacity="0.8" />

      {/* 中景の丘 */}
      <path d="M0 268 C 240 248, 480 274, 720 264 C 960 254, 1200 278, 1440 262 L1440 300 L0 300 Z"
        fill="url(#hs-mid)" />

      {/* 川（奥から手前へ広がる） */}
      <path d="M684 258 L756 258 L1010 420 L430 420 Z" fill="url(#hs-river)" />

      {/* 川のさざ波 */}
      <g stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round">
        <line x1="700" y1="300" x2="740" y2="300" />
        <line x1="682" y1="338" x2="758" y2="338" />
        <line x1="658" y1="378" x2="782" y2="378" />
        <line x1="632" y1="414" x2="808" y2="414" />
      </g>

      {/* 手前の土手（左右） */}
      <path d="M0 282 C 220 268, 420 288, 450 300 L330 420 L0 420 Z" fill="url(#hs-near)" />
      <path d="M1440 282 C 1220 268, 1020 288, 990 300 L1110 420 L1440 420 Z" fill="url(#hs-near)" />

      {/* 土手のススキ・草（控えめ） */}
      <g stroke="#0E4A2E" strokeWidth="3" strokeLinecap="round" opacity="0.75">
        <path d="M150 420 L150 366 M150 380 L132 362 M150 380 L168 362" />
        <path d="M214 420 L214 384 M214 396 L200 382 M214 396 L228 382" />
        <path d="M1290 420 L1290 366 M1290 380 L1272 362 M1290 380 L1308 362" />
        <path d="M1226 420 L1226 386 M1226 398 L1212 384 M1226 398 L1240 384" />
      </g>
    </svg>
  )
}
