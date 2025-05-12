// components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fjern standard ikonfeil i Leaflet
delete (L.Icon.Default as any).prototype._getIconUrl
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
  useEffect(() => {
    // trigger resize fix
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 500)
  }, [])

  const center = markorer.length
    ? [markorer[0].lat, markorer[0].lng]
    : [60.472, 8.468] // fallback: Norge

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={6}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
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
