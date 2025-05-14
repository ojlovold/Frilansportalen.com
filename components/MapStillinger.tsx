import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Stilling = {
  id: string;
  tittel: string;
  lokasjon?: {
    tekst?: string;
    lat?: number;
    lng?: number;
  };
};

export default function MapStillinger({ stillinger }: { stillinger: Stilling[] }) {
  const midtpunkt = [60.472, 8.468]; // Norge sentrum

  return (
    <div className="h-[500px] w-full rounded shadow">
      <MapContainer center={midtpunkt} zoom={5} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {stillinger?.map((s) => (
          s.lokasjon?.lat && s.lokasjon?.lng && (
            <Marker
              key={s.id}
              position={[s.lokasjon.lat, s.lokasjon.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{s.tittel}</strong>
                <br />
                {s.lokasjon.tekst || "Ukjent sted"}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
