import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";
import { aiMatch } from "@/lib/aiMatch";
import fylkerOgKommuner from "@/data/fylkerOgKommuner.json";

const kategorier = [
  "Alle", "Klær", "Møbler", "Elektronikk", "Kjøkken", "Verktøy", "Sport og fritid", "Barneutstyr",
  "Bygg og oppussing", "Kontor", "Data", "Interiør", "Leker", "Bøker", "Skjønnhet", "Musikk",
  "Hobby", "Bil og motor", "Hage", "Annet"
];

const typer = ["Alle", "Til salgs", "Gis bort", "Ønskes kjøpt", "Ønskes"];

const fylker = ["Alle", ...Object.keys(fylkerOgKommuner)];

export default function Gjenbruksportalen() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [kategori, setKategori] = useState("Alle");
  const [type, setType] = useState("Alle");
  const [fylke, setFylke] = useState("Alle");
  const [kommune, setKommune] = useState("Alle");
  const [kommuneSøk, setKommuneSøk] = useState("");
  const [visKommunevalg, setVisKommunevalg] = useState(false);

  const aktiveKommuner = fylke === "Alle" ? [] : fylkerOgKommuner[fylke] || [];

  const filtrerteKommunevalg = aktiveKommuner.filter((k) =>
    k.toLowerCase().startsWith(kommuneSøk.toLowerCase()) && k !== kommune
  );

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("annonser")
        .select("*")
        .order("created_at", { ascending: false });

      setAnnonser(data || []);
    };
    hent();
  }, []);

  const aiKategorier = aiMatch(kategori === "Alle" ? "" : kategori);

  const filtrert = annonser.filter((a) => {
    const tekst = (a.tittel + " " + a.beskrivelse).toLowerCase();
    const kategoriOk = kategori === "Alle" || aiKategorier.some((k) => tekst.includes(k.toLowerCase()));
    const typeOk = type === "Alle" || a.type === type;
    const fylkeOk = fylke === "Alle" || (a.fylke || "").toLowerCase() === fylke.toLowerCase();
    const kommuneOk = kommune === "Alle" || (a.kommune || "").toLowerCase() === kommune.toLowerCase();
    return kategoriOk && typeOk && fylkeOk && kommuneOk;
  });

  return (
    <>
      <Head>
        <title>Gjenbruksportalen | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-yellow-300 text-black px-4 py-6">
        <div className="flex justify-between items-center mb-8 max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold">Gjenbruksportalen</h1>
          <Link href="/" className="text-sm underline text-blue-600">
            Tilbake til forsiden
          </Link>
        </div
