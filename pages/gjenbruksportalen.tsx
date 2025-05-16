import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";
import { aiMatch } from "@/lib/aiMatch";

export default function Gjenbruksportalen() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [søk, setSøk] = useState("");
  const [brukerId, setBrukerId] = useState<string | null>(null);

  useEffect(() => {
    const hentData = async () => {
      const { data } = await supabase
        .from("annonser")
        .select("*")
        .order("created_at", { ascending: false });

      setAnnonser(data || []);

      const { data: brukerdata } = await supabase.auth.getUser();
      setBrukerId(brukerdata?.user?.id || null);
    };

    hentData();
  }, []);

  const håndterSøk = async (e: React.FormEvent) => {
    e.preventDefault();

    if (brukerId && søk.trim()) {
      await supabase.from("brukermønster").insert([
        {
          bruker_id: brukerId,
          handling: "søk",
          verdi: søk,
        },
      ]);
    }
  };

  const synonymer = aiMatch(søk);

  const filtrert = annonser.filter((a) => {
    if (!søk) return true;

    const tekst = (a.tittel + a.beskrivelse).toLowerCase();
    return synonymer.some((ord) => tekst.includes(ord.toLowerCase()));
  });

  return (
    <>
      <Head>
        <title>Gjenbruksportalen | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gjenbruksportalen</h1>
          <Link href="/" className="text-sm text-blue-600 underline">
            Tilbake til forsiden
          </Link>
        </div>

        <form onSubmit={håndterSøk} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Søk etter annonse"
            value={søk}
            onChange={(e) => setSøk(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">
            Søk
          </button>
        </form>

        {filtrert.length === 0 ? (
          <p>Ingen annonser funnet.</p>
        ) : (
          filtrert.map((annonse) => (
            <AnnonseKort key={annonse.id} annonse={annonse} />
          ))
        )}
      </main>
    </>
  );
}
