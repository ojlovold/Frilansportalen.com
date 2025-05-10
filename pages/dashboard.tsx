import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../utils/supabaseClient";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Dashboard() {
  const [markører, setMarkører] = useState<any[]>([]);
  const [brukernavn, setBrukernavn] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      const profil = await supabase.from("profiler").select("navn").eq("id", id).single();
      if (profil.data?.navn) setBrukernavn(profil.data.navn);

      const [stillinger, gjenbruk] = await Promise.all([
        supabase.from("stillinger").select("tittel, sted").limit(10),
        supabase.from("gjenbruk").select("tittel, sted").limit(10),
      ]);

      const samlet = [...(stillinger.data || []), ...(gjenbruk.data || [])];
      const konvertert = await Promise.all(
        samlet.filter((s) => s.sted).map(async (s) => {
          const geo = await fetch(`/api/geokode?adresse=${encodeURIComponent(s.sted)}`).then((r) => r.json());
          return { tittel: s.tittel, lat: geo.lat, lng: geo.lng };
        })
      );

      setMarkører(konvertert);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Hei {brukernavn || "!"}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-sm">
          <Link href="/mva" className="bg-white border p-4 rounded shadow-sm">MVA-rapportering</Link>
          <Link href="/kjorebok" className="bg-white border p-4 rounded shadow-sm">Kjørebok</Link>
          <Link href="/rapportarkiv" className="bg-white border p-4 rounded shadow-sm">Rapportarkiv</Link>
          <Link href="/altinn" className="bg-white border p-4 rounded shadow-sm">Send til Altinn</Link>
        </div>

        <h2 className="text-xl font-semibold mb-4">Oppdrag og tjenester på kart</h2>
        <div className="h-[400px] border rounded overflow-hidden">
          <Map markører={markører} />
        </div>
      </div>
    </Layout>
  );
}
