// pages/rapporteksport.tsx
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";

export default function RapportEksport() {
  const rawUser = useUser();
  const userId =
    typeof rawUser === "object" && rawUser !== null && "id" in rawUser
      ? String(rawUser.id)
      : null;

  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [kjorebok, setKjorebok] = useState<any[]>([]);
  const [kvitteringer, setKvitteringer] = useState<any[]>([]);

  useEffect(() => {
    const hentData = async () => {
      if (!userId) return;

      const f = await supabase
        .from("fakturaer")
        .select("*")
        .eq("frilanser_id", userId);
      if (f.data) setFakturaer(f.data);

      const k = await supabase
        .from("kjorebok")
        .select("*")
        .eq("bruker_id", userId);
      if (k.data) setKjorebok(k.data);

      const kv = await supabase.storage
        .from("dokumenter")
        .list(`kvitteringer/${userId}`, { limit: 100 });
      if (kv.data) setKvitteringer(kv.data);
    };

    hentData();
  }, [userId]);

  return (
    <Layout>
      <Head>
        <title>Rapporteksport | Frilansportalen</title>
      </Head>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Eksporter rapporter</h1>

        <div className="space-y-6">
          <div>
            <h2 className="font-semibold">Fakturaer ({fakturaer.length})</h2>
            <ul className="list-disc ml-6 text-sm text-black">
              {fakturaer.map((f) => (
                <li key={f.id}>
                  {f.tjeneste} – {new Date(f.opprettet_dato).toLocaleDateString("no-NO")}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Kjørebok ({kjorebok.length})</h2>
            <ul className="list-disc ml-6 text-sm text-black">
              {kjorebok.map((k) => (
                <li key={k.id}>
                  {k.dato} – {k.fra} → {k.til} ({k.kilometer} km)
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Kvitteringer ({kvitteringer.length})</h2>
            <ul className="list-disc ml-6 text-sm text-black">
              {kvitteringer.map((k) => (
                <li key={k.name}>
                  <a
                    href={`https://<your-project>.supabase.co/storage/v1/object/public/dokumenter/kvitteringer/${userId}/${k.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    {k.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
