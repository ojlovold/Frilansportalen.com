'use client'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { useEffect, useState } from 'react'

// Dynamiske imports
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })

// Fiks ikonvisning
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type MarkerType = {
  id: string
  lat: number
  lng: number
  tittel: string
}

export default function Map({ markorer }: { markorer: MarkerType[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const center: LatLngExpression = markorer.length
    ? [markorer[0].lat, markorer[0].lng]
    : [60.472, 8.468] // fallback: Norge

  if (!mounted) return null

  return (
    <MapContainer
      defaultCenter={center}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markorer.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>{m.tittel}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
