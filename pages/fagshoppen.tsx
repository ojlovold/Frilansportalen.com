import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";

export default function Fagshoppen() {
  const [annonser, setAnnonser] = useState<any[]>([]);

  useEffect(() => {
    const hentAnnonser = async () => {
      const { data: alle, error } = await supabase
        .from("annonser")
        .select("*, brukere(type)")
        .order("created_at", { ascending: false });

      // Filtrer ut kun annonser lagt ut av firmaer
      const kunFirmaannonser = (alle || []).filter((a) => a.brukere?.type === "firma");

      setAnnonser(kunFirmaannonser);
    };

    hentAnnonser();
  }, []);

  return (
    <>
      <Head>
        <title>Fagshoppen | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fagshoppen</h1>
          <Link href="/" className="text-sm text-blue-600 underline">
            Tilbake til forsiden
          </Link>
        </div>

        {annonser.length === 0 ? (
          <p>Ingen firmaannonser enda.</p>
        ) : (
          annonser.map((annonse) => (
            <AnnonseKort key={annonse.id} annonse={annonse} />
          ))
        )}
      </main>
    </>
  );
}
