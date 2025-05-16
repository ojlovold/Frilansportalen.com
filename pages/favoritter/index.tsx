import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";

export default function Favoritter() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [brukerId, setBrukerId] = useState<string | null>(null);

  useEffect(() => {
    const hentFavoritter = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData?.user?.id;
      setBrukerId(id);

      if (!id) return;

      const { data: favorittData } = await supabase
        .from("favoritter")
        .select("annonse_id");

      const favorittIds = (favorittData || [])
        .filter((f) => f.bruker_id === id)
        .map((f) => f.annonse_id);

      if (favorittIds.length === 0) return;

      const { data: annonserData } = await supabase
        .from("annonser")
        .select("*")
        .in("id", favorittIds);

      setAnnonser(annonserData || []);
    };

    hentFavoritter();
  }, []);

  return (
    <>
      <Head>
        <title>Mine favoritter | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mine favoritter</h1>
          <Link href="/" className="text-sm text-blue-600 underline">
            Tilbake til forsiden
          </Link>
        </div>

        {annonser.length === 0 ? (
          <p>Du har ingen lagrede annonser.</p>
        ) : (
          annonser.map((annonse) => (
            <AnnonseKort key={annonse.id} annonse={annonse} />
          ))
        )}
      </main>
    </>
  );
}
