import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Dashboard() {
  const [brukernavn, setBrukernavn] = useState("");
  const [varsler, setVarsler] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data: bruker } = await supabase.auth.getUser();
      const uid = bruker.user?.id;

      const profil = await supabase.from("profiler").select("navn").eq("id", uid).single();
      if (profil.data?.navn) setBrukernavn(profil.data.navn);

      const { data: varselliste } = await supabase
        .from("varsler")
        .select("*")
        .eq("bruker_id", uid)
        .order("opprettet_dato", { ascending: false });

      setVarsler(varselliste || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Hei {brukernavn || "!"}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <Link
          href="/faktura"
          className="bg-white border border-black rounded p-6 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">Faktura</h2>
          <p className="text-sm text-gray-600">Opprett og send fakturaer</p>
        </Link>
        <Link
          href="/kjorebok"
          className="bg-white border border-black rounded p-6 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">Kjørebok</h2>
          <p className="text-sm text-gray-600">Registrer turer og kjøregodtgjørelse</p>
        </Link>
        <Link
          href="/mva"
          className="bg-white border border-black rounded p-6 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">MVA</h2>
          <p className="text-sm text-gray-600">Håndter MVA og fradrag</p>
        </Link>
        <Link
          href="/profil"
          className="bg-white border border-black rounded p-6 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">Profil</h2>
          <p className="text-sm text-gray-600">Rediger navn, bilde og rolle</p>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-2">Varsler</h2>

      {varsler.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen varsler akkurat nå.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {varsler.map((v) => (
            <li key={v.id} className="border p-3 bg-white rounded shadow-sm">
              <p className="text-gray-500 text-xs mb-1">
                {new Date(v.opprettet_dato).toLocaleString("no-NO")}
              </p>
              <p>{v.tekst}</p>
              {v.lenke && (
                <Link
                  href={v.lenke}
                  className="text-xs underline text-blue-600 hover:text-blue-800"
                >
                  Gå til
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
