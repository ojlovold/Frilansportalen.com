import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // viktig!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orgnr, brukerId } = req.body;

  if (!orgnr || !brukerId) {
    return res.status(400).json({ error: "orgnr og brukerId kreves" });
  }

  try {
    // 1. Sjekk om firmaet finnes
    const { data: eksisterende } = await supabase
      .from("firmaer")
      .select("id")
      .eq("organisasjonsnummer", orgnr)
      .maybeSingle();

    let firmaId = eksisterende?.id;

    // 2. Hvis ikke, hent fra Brreg
    if (!firmaId) {
      const brregRes = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
      if (!brregRes.ok) return res.status(404).json({ error: "Fant ikke firma i Brønnøysund" });
      const firma = await brregRes.json();

      const { data: opprettet, error: insertFeil } = await supabase
        .from("firmaer")
        .insert([{
          navn: firma.navn,
          organisasjonsnummer: firma.organisasjonsnummer,
          adresse: firma.forretningsadresse?.adresse?.[0] || null,
          postnummer: firma.forretningsadresse?.postnummer || null,
          poststed: firma.forretningsadresse?.poststed || null,
          kommune: firma.forretningsadresse?.kommune || null,
          fylke: firma.forretningsadresse?.kommunenummer?.slice(0, 2) || null,
          nettside: firma.hjemmeside || null,
          bransje: firma.naeringskode1?.beskrivelse || null
        }])
        .select();

      if (insertFeil || !opprettet || !opprettet[0]?.id) {
        return res.status(500).json({ error: "Klarte ikke opprette firma" });
      }

      firmaId = opprettet[0].id;
    }

    // 3. Koble bruker til firma
    const { error: updateFeil } = await supabase
      .from("brukere")
      .update({ firma_id: firmaId })
      .eq("id", brukerId);

    if (updateFeil) {
      return res.status(500).json({ error: "Klarte ikke oppdatere brukeren" });
    }

    return res.status(200).json({ success: true, firmaId });
  } catch (err) {
    return res.status(500).json({ error: "Ukjent feil", detaljer: String(err) });
  }
}
