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

const typer = ["Alle", "Til salgs", "Gis bort", "Ønskes kjøpt", "Ønskes"];

const fylker = [
  "Alle", "Oslo", "Viken", "Innlandet", "Vestfold og Telemark", "Agder",
  "Rogaland", "Vestland", "Møre og Romsdal", "Trøndelag", "Nordland", "Troms og Finnmark"
];

const kommuner = [
  "Alle", "Bergen", "Oslo", "Stavanger", "Trondheim", "Tønsberg", "Tromsø",
  "Fredrikstad", "Kristiansand", "Drammen", "Sandnes", "Bodø", "Larvik", "Halden"
];

export default function Fagshoppen() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [kategori, setKategori] = useState("Alle");
  const [type, setType] = useState("Alle");
  const [fylke, setFylke] =
