// pages/kart.tsx
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function KartSide() {
  const [userLocation, setUserLocation] = useState<LatLngExpression>([60.472, 8.4689]); // Standard Norge

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.warn("Geolocation ikke tillatt – bruker standardposisjon.");
        }
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Kart | Frilansportalen</title>
        <meta name="description" content="Vis kart over annonser og brukere" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Kart</h1>
        <Map center={userLocation} />
      </main>
    </>
  );
}
