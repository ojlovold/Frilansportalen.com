import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { brukerHarPremium } from "../utils/brukerHarPremium";
import PremiumBox from "../components/PremiumBox";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Kart() {
  const [markører, setMarkører] = useState<any[]>([]);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    brukerHarPremium().then(setPremium);

    const hent = async () => {
      const [stillinger, gjenbruk] = await Promise.all([
        fetch("/api/supabase-proxy?table=stillinger").then((r) => r.json()),
        fetch("/api/supabase-proxy?table=gjenbruk").then((r) => r.json()),
      ]);

      const kombinert = [...stillinger, ...gjenbruk];
      const medKoord = await Promise.all(
        kombinert
          .filter((s) => s.sted)
          .map(async (s) => {
            const geo = await fetch(`/api/geokode?adresse=${encodeURIComponent(s.sted)}`).then((r) => r.json());
            return {
              tittel: s.tittel,
              lat: geo.lat,
              lng: geo.lng,
              type: s.type || "Annonse",
            };
          })
      );

      setMarkører(medKoord);
    };

    hent();
  }, []);

  if (!premium) {
    return (
      <Layout>
        <Head><title>Kart</title></Head>
        <div className="max-w-xl mx-auto py-10"><PremiumBox /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>Kart | Frilansportalen</title></Head>
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Annonser på kart</h1>
        <div className="h-[500px] rounded overflow-hidden">
          <Map markører={markører} />
        </div>
      </div>
    </Layout>
  );
}
