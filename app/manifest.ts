import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TAMA BASE | 川崎市多摩区の地域情報',
    short_name: 'TAMA BASE',
    description: '川崎市多摩区のお店・公園・子育て情報をまとめてチェック',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#15803d',
    orientation: 'portrait',
    categories: ['lifestyle', 'navigation', 'local'],
    lang: 'ja',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'お店を探す',
        url: '/shops',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: '公園を探す',
        url: '/parks',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'マップで見る',
        url: '/map',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
