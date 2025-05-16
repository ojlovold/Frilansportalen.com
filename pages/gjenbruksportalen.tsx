import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";
import { aiMatch } from "@/lib/aiMatch";

const kategorier = [
  "Alle", "Klær", "Møbler", "Elektronikk", "Kjøkken", "Verktøy", "Sport og fritid", "Barneutstyr",
  "Bygg og oppussing", "Kontor", "Data", "Interiør", "Leker", "Bøker", "Skjønnhet", "Musikk",
  "Hobby", "Bil og motor", "Hage", "Annet"
];

const steder = [
  "Hele landet", "Oslo", "Viken", "Innlandet", "Vestfold og Telemark", "Agder",
  "Rogaland", "Vestland", "Møre og Romsdal", "Trøndelag", "Nordland", "Troms og Finnmark"
];

export default function Gjenbruksportalen() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [kategori, setKategori] = useState("Alle");
  const [sted, setSted] = useState("Hele landet");
  const [brukerId, setBrukerId] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      const { data: annonserData } = await supabase.from("annonser").select("*").order("created_at", { ascending: false });
      setAnnonser(annonserData || []);

      const { data: brukerData } = await supabase.auth.getUser();
      setBrukerId(brukerData?.user?.id ?? null);
    };

    hent();
  }, []);

  const aiKategorier = aiMatch(kategori === "Alle" ? "" : kategori);

  const filtrert = annonser.filter((a) => {
    const tekst = (a.tittel + " " + a.beskrivelse).toLowerCase();
    const kategoriMatch = kategori === "Alle" || aiKategorier.some((k) => tekst.includes(k.toLowerCase()));
    const stedMatch = sted === "Hele landet" || (a.sted || "").toLowerCase().includes(sted.toLowerCase());
    return kategoriMatch && stedMatch;
  });

  return (
    <>
      <Head>
        <title>Gjenbruksportalen | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gjenbruksportalen</h1>
          <Link href="/" className="text-sm text-blue-600 underline">Tilbake til forsiden</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full p-2 rounded border"
            >
              {kategorier.map((kat) => (
                <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sted</label>
            <select
              value={sted}
              onChange={(e) => setSted(e.target.value)}
              className="w-full p-2 rounded border"
            >
              {steder.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

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
