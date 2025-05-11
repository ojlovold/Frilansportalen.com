import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabaseClient";

// Midlertidig eksempeldata – kan erstattes med webscraper senere
const eksterneKilder = [
  {
    tittel: "Arbeidstilsynet – HMS-skjema",
    beskrivelse: "Offisielt HMS-skjema fra arbeidstilsynet.",
    kategori: "HMS",
    url: "https://www.arbeidstilsynet.no/skjema/hms",
  },
  {
    tittel: "NAV – Skjema for sykepenger",
    beskrivelse: "Direktelenke til NAV sitt offisielle sykepengesystem.",
    kategori: "Skjema",
    url: "https://www.nav.no/sykepenger",
  },
  {
    tittel: "Standard Norge – Bransjestandard for bygg",
    beskrivelse: "Oversikt over krav og standarder for bygg- og anlegg.",
    kategori: "Bransjestandard",
    url: "https://www.standard.no/nettbutikk/bygg-anlegg-og-eiendom",
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  let lagtTil = 0;

  for (const kilde of eksterneKilder) {
    const { data: eksisterende } = await supabase
      .from("fagbibliotek")
      .select("id")
      .eq("url", kilde.url)
      .maybeSingle();

    if (!eksisterende) {
      const { error } = await supabase.from("fagbibliotek").insert([kilde]);
      if (!error) lagtTil++;
    }
  }

  return res.status(200).json({ status: "ok", lagtTil });
}
