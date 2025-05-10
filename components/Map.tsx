import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ markører }: { markører: any[] }) {
  return (
    <MapContainer center={[60, 10]} zoom={5} scrollWheelZoom className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markører.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>
            <strong>{m.tittel}</strong><br />
            {m.type}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
