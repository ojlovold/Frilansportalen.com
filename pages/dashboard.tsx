import Head from "next/head";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";
import AutoPDFKnapp from "../components/AutoPDFKnapp";

export default function Dashboard() {
  const { user } = useUser();
  const [rapporter, setRapporter] = useState<any[]>([]);
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [kjorebok, setKjorebok] = useState<any[]>([]);

  useEffect(() => {
    const hentData = async () => {
      if (!user || !user.id) return;

      const brukerId = user.id;

      const [r1, r2, r3] = await Promise.all([
        supabase.from("rapporter").select("*").eq("user_id", brukerId),
        supabase.from("faktura").select("*").eq("user_id", brukerId),
        supabase.from("kjorebok").select("*").eq("user_id", brukerId)
      ]);

      if (!r1.error) setRapporter(r1.data || []);
      if (!r2.error) setFakturaer(r2.data || []);
      if (!r3.error) setKjorebok(r3.data || []);
    };

    hentData();
  }, [user]);

  return (
    <>
      <Head>
        <title>Dashboard | Frilansportalen</title>
        <meta name="description" content="Oversikt over rapporter, fakturaer og kjørebok" />
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <h1 className="text-3xl font-bold mb-6">Mitt dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Rapporter</h2>
          <AutoPDFKnapp data={rapporter} />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Fakturaer</h2>
          <AutoPDFKnapp data={fakturaer} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Kjørebok</h2>
          <AutoPDFKnapp data={kjorebok} />
        </section>
      </main>
    </>
  );
}
