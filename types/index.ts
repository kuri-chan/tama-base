export type Shop = {
  id: string
  created_at: string
  name: string
  category: string
  address: string
  lat: number
  lng: number
  hours: string | null
  phone: string | null
  website: string | null
  description: string | null
  is_new_open: boolean
  open_date: string | null
  child_friendly: boolean
  stroller_ok: boolean
  kids_menu: boolean
  nursing_room: boolean
  diaper_change: boolean
  kids_space: boolean
  tags: string[] | null
  images: string[] | null
}

export type Park = {
  id: string
  created_at: string
  name: string
  address: string
  lat: number
  lng: number
  description: string | null
  has_toilet: boolean
  has_parking: boolean
  has_bench: boolean
  has_shade: boolean
  equipment: string[] | null
  age_range: string | null
  tags: string[] | null
  images: string[] | null
}
