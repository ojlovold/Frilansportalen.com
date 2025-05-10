import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const iDag = new Date();
  const om7dager = new Date(iDag.getTime() + 7 * 86400000);

  const { data: attester } = await supabase
    .from("attester")
    .select("id, bruker_id, tittel, utløpsdato")
    .lt("utløpsdato", om7dager.toISOString())
    .gte("utløpsdato", iDag.toISOString());

  for (const a of attester || []) {
    await supabase.from("varsler").insert({
      bruker_id: a.bruker_id,
      tekst: `Dokumentet "${a.tittel}" utløper snart.`,
      lenke: "/attester",
    });

    await fetch("/api/send-kopi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fra: "system",
        melding: `Påminnelse: Dokumentet "${a.tittel}" utløper om kort tid.`,
        bruker_id: a.bruker_id,
      }),
    });
  }

  res.status(200).json({ status: "Varsler sendt", antall: attester?.length || 0 });
}
