import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // må bruke server-nøkkel!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orgnr = req.query.orgnr || req.body.orgnr;

  if (!orgnr || typeof orgnr !== "string") {
    return res.status(400).json({ error: "Ugyldig organisasjonsnummer" });
  }

  try {
    const url = `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
    const brregRes = await fetch(url);
    if (!brregRes.ok) throw new Error("Fant ikke firma i Brønnøysund");

    const firma = await brregRes.json();

    const { data, error } = await supabase.from("firmaer").upsert({
      navn: firma.navn,
      organisasjonsnummer: firma.organisasjonsnummer,
      adresse: firma.forretningsadresse?.adresse?.[0] || null,
      postnummer: firma.forretningsadresse?.postnummer || null,
      poststed: firma.forretningsadresse?.poststed || null,
      kommune: firma.forretningsadresse?.kommune || null,
      fylke: firma.forretningsadresse?.kommunenummer?.slice(0, 2) || null,
      nettside: firma.hjemmeside || null,
      bransje: firma.naeringskode1?.beskrivelse || null
    });

    if (error) {
      return res.status(500).json({ error: "Kunne ikke lagre i Supabase", detaljer: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: "Feil ved import", detaljer: String(err) });
  }
}
