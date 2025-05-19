// pages/admin/systemstatus.tsx
import Head from "next/head";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import AdminSystemstatus from "@/components/AdminSystemstatus";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Integrasjon {
  id: string;
  aktiv: boolean;
  api_key?: string;
  client_id?: string;
  client_secret?: string;
  orgnr?: string;
  sist_oppdatert?: string;
}

export default function SystemstatusSide() {
  const [data, setData] = useState<Integrasjon[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("integrasjoner").select("*");
      if (data) setData(data);
    };
    hent();
  }, []);

  const erGyldig = (item: Integrasjon) =>
    item.api_key &&
    (item.id !== "altinn" || item.orgnr) &&
    (item.id !== "vipps" || (item.client_id && item.client_secret)) &&
    item.aktiv;

  return (
    <>
      <Head>
        <title>Systemstatus | Frilansportalen Admin</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-6 max-w-6xl mx-auto">
        <TilbakeKnapp />
        <h1 className="text-3xl font-bold mb-6">Systemstatus</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Modulstatus</h2>
          <AdminSystemstatus />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Integrasjoner</h2>
          <div className="grid gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded shadow ${
                  erGyldig(item) ? 
