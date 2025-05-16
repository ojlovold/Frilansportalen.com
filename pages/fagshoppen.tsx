import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";
import { aiMatch } from "@/lib/aiMatch";
import fylkerOgKommuner from "@/data/fylkerOgKommuner.json";

const kategorier = [
  "Alle", "Klær", "Møbler", "Elektronikk", "Verktøy", "Kjøkken", "Håndverk", "Data", "Bygg",
  "Kontor", "Interiør", "Skjønnhet", "Helse", "Transport", "Annet"
];

const typer = ["Alle", "Til salgs", "Tjeneste", "Utleie", "Ønskes kjøpt"];

const fylker = ["Alle", ...Object.keys(fylkerOgKommuner)];

export default function Fagshoppen() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [kategori, setKategori] = useState("Alle");
  const [type, setType] = useState("Alle");
  const [fylke, setFylke] = useState("Alle");
  const [kommune, setKommune] = useState("Alle");
  const [kommuneSøk, setKommuneSøk] = useState("");
  const [visKommunevalg, setVisKommunevalg] = useState(false);
  const [firmanavn, setFirmanavn] = useState("");

  const aktiveKommuner =
    fylke === "Alle"
      ? []
      : fylkerOgKommuner[fylke as keyof typeof fylkerOgKommuner] || [];

  const filtrerteKommunevalg = aktiveKommuner.filter((k) =>
    k.toLowerCase().startsWith(kommuneSøk.toLowerCase()) && k !== kommune
  );

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("annonser")
        .select("*, brukere(type)")
        .order("created_at", { ascending: false });

      const kunFirma = (data || []).filter((a) => a.brukere?.type === "firma");
      setAnnonser(kunFirma);
    };

    hent();
  }, []);

  const aiKategorier = aiMatch(kategori === "Alle" ? "" : kategori);

  const filtrert = annonser.filter((a) => {
    const tekst = (a.tittel + " " + a.beskrivelse).toLowerCase();
    const firmanavnOk = !firmanavn || a.bruker_navn?.toLowerCase().includes(firmanavn.toLowerCase());
    const kategoriOk = kategori === "Alle" || aiKategorier.some((k) => tekst.includes(k.toLowerCase()));
    const typeOk = type === "Alle" || a.type === type;
    const fylkeOk = fylke === "Alle" || (a.fylke || "").toLowerCase() === fylke.toLowerCase();
    const kommuneOk = kommune === "Alle" || (a.kommune || "").toLowerCase() === kommune.toLowerCase();
    return kategoriOk && typeOk && fylkeOk && kommuneOk && firmanavnOk;
  });

  return (
    <>
      <Head>
        <title>Fagshoppen | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-yellow-300 text-black px-4 py-6">
        <div className="flex justify-between items-center mb-8 max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold">Fagshoppen</h1>
          <Link href="/" className="text-sm underline text-blue-600">
            Tilbake til forsiden
          </Link>
        </div>

        <div className="bg-gray-200 rounded-2xl p-4 shadow-inner mb-8 max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Kategori</label>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full p-2 rounded border">
              {kategorier.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 rounded border">
              {typer.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Fylke</label>
            <select
              value={fylke}
              onChange={(e) => {
                setFylke(e.target.value);
                setKommune("Alle");
                setKommuneSøk("");
              }}
              className="w-full p-2 rounded border"
            >
              {fylker.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">Kommune</label>
            <input
              value={kommuneSøk}
              onChange={(e) => {
                setKommuneSøk(e.target.value);
                setVisKommunevalg(true);
              }}
              onFocus={() => setVisKommunevalg(true)}
              className="w-full p-2 rounded border"
              placeholder={fylke === "Alle" ? "Velg fylke først" : "Søk kommune..."}
              disabled={fylke === "Alle"}
            />
            {visKommunevalg && fylke !== "Alle" && (
              <ul className="absolute z-10 w-full bg-white border mt-1 rounded max-h-48 overflow-y-auto">
                {filtrerteKommunevalg.map((k) => (
                  <li
                    key={k}
                    onClick={() => {
                      setKommune(k);
                      setKommuneSøk(k);
                      setVisKommunevalg(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {k}
                  </li>
                ))}
                {filtrerteKommunevalg.length === 0 && (
                  <li className="px-3 py-2 text-gray-500 text-sm">Ingen treff</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto mb-8">
          <label className="block text-sm font-semibold mb-1">Finn firma / butikk</label>
          <input
            type="text"
            value={firmanavn}
            onChange={(e) => setFirmanavn(e.target.value)}
            placeholder="Søk etter firmanavn..."
            className="w-full p-2 rounded border"
          />
        </div>

        <div className="max-w-screen-lg mx-auto space-y-4">
          {filtrert.length === 0 ? (
            <p>Ingen firmaannonser funnet.</p>
          ) : (
            filtrert.map((annonse) => (
              <AnnonseKort key={annonse.id} annonse={annonse} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
