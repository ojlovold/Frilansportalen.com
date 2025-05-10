import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Kart() {
  const [markører, setMarkører] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const stillinger = await fetchAnnonser("stillinger");
      const gjenbruk = await fetchAnnonser("gjenbruk");

      const kombinert = [...stillinger, ...gjenbruk];
      setMarkører(kombinert);
    };

    const fetchAnnonser = async (tabell: string) => {
      const res = await fetch(`/api/supabase-proxy?table=${tabell}`);
      const data = await res.json();

      const medKoordinater = await Promise.all(
        data
          .filter((d: any) => d.sted)
          .map(async (d: any) => {
            const geo = await fetch(`/api/geokode?adresse=${encodeURIComponent(d.sted)}`).then((r) => r.json());
            return {
              tittel: d.tittel || "(Uten tittel)",
              lat: geo.lat,
              lng: geo.lng,
              type: tabell === "stillinger" ? "Stilling" : "Gjenbruk",
            };
          })
      );

      return medKoordinater;
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Kart | Frilansportalen</title>
      </Head>

      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Annonser på kart</h1>
        <div className="h-[500px] rounded overflow-hidden">
          <Map markører={markører} />
        </div>
      </div>
    </Layout>
  );
}
