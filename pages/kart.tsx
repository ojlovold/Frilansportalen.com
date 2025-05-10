import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Kart() {
  const [markører, setMarkører] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const [stillinger, gjenbruk] = await Promise.all([
        // Fiktiv koordinatbruk
        { data: [{ tittel: "Fotograf Oslo", lat: 59.9139, lng: 10.7522 }] },
        { data: [{ tittel: "Gis bort: kontorstol", lat: 60.3913, lng: 5.3221 }] },
      ]);

      setMarkører([
        ...(stillinger.data || []).map((s) => ({ ...s, type: "Stilling" })),
        ...(gjenbruk.data || []).map((g) => ({ ...g, type: "Gjenbruk" })),
      ]);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Kart | Frilansportalen</title>
      </Head>

      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Oppdrag og tjenester på kart</h1>
        <div className="h-[500px] rounded overflow-hidden">
          <Map markører={markører} />
        </div>
      </div>
    </Layout>
  );
}
