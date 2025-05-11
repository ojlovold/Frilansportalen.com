// components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fiks for manglende ikoner i produksjon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

type MapProps = {
  markører: { lat: number; lng: number; tekst: string }[]
}

export default function Map({ markører }: MapProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet')
    }
  }, [])

  return (
    <MapContainer center={[63.4, 10.4]} zoom={5} scrollWheelZoom className="h-[500px] w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markører.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>{m.tekst}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
