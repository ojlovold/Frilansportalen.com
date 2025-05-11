import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Dokumenter() {
  const [kvitteringer, setKvitteringer] = useState<any[]>([]);
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [rapporter, setRapporter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const [kv, fa, ra] = await Promise.all([
        supabase.from("kvitteringer").select("*").eq("bruker_id", id),
        supabase.from("fakturaer").select("filnavn, tjeneste, opprettet_dato").eq("bruker_id", id),
        supabase.from("rapportarkiv").select("navn, opprettet_dato").eq("bruker_id", id),
      ]);

      setKvitteringer(kv.data || []);
      setFakturaer(fa.data || []);
      setRapporter(ra.data || []);
    };

    hent();
  }, []);

  const baseURL = "https://tvnwbchnvnhehuzrzqfq.supabase.co/storage/v1/object/public";

  const formatDato = (dato: string) =>
    new Date(dato).toLocaleDateString("no-NO");

  return (
    <Layout>
      <Head>
        <title>Mine dokumenter | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10 text-sm">
        <h1 className="text-2xl font-bold mb-6">Mine dokumenter</h1>

        <h2 className="text-base font-semibold mb-2">Kvitteringer</h2>
        <ul className="mb-6 space-y-2">
          {kvitteringer.map((k) => (
            <li key={k.id} className="flex justify-between border-b pb-1">
              <span>{k.type} ({formatDato(k.dato)})</span>
              <a
                href={`${baseURL}/kvitteringer/${k.navn}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                Last ned
              </a>
            </li>
          ))}
          {kvitteringer.length === 0 && <p className="text-gray-500">Ingen kvitteringer.</p>}
        </ul>

        <h2 className="text-base font-semibold mb-2">Fakturaer</h2>
        <ul className="mb-6 space-y-2">
          {fakturaer.map((f, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>{f.tjeneste} ({formatDato(f.opprettet_dato)})</span>
              <a
                href={`${baseURL}/faktura-filer/${f.filnavn}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                Last ned
              </a>
            </li>
          ))}
          {fakturaer.length === 0 && <p className="text-gray-500">Ingen fakturaer.</p>}
        </ul>

        <h2 className="text-base font-semibold mb-2">Rapporter</h2>
        <ul className="space-y-2">
          {rapporter.map((r, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>Årsrapport ({formatDato(r.opprettet_dato)})</span>
              <a
                href={`${baseURL}/faktura-filer/${r.navn}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                Last ned
              </a>
            </li>
          ))}
          {rapporter.length === 0 && <p className="text-gray-500">Ingen rapporter.</p>}
        </ul>
      </div>
    </Layout>
  );
}
