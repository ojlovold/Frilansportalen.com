import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from("attester")
      .select("id, bruker_id, tittel, utlop")

    if (error) throw error;

    // Sikre at typene er korrekte
    type Attest = {
      id: string;
      bruker_id: string;
      tittel: string;
      utlop: string;
    };

    const attester = (data as Attest[]) || [];

    for (const a of attester) {
      const utløpsdato = new Date(a.utlop);
      const iDag = new Date();

      const dagerIgjen = Math.ceil((utløpsdato.getTime() - iDag.getTime()) / (1000 * 60 * 60 * 24));

      if (dagerIgjen <= 14) {
        await supabase.from("varsler").insert({
          bruker_id: a.bruker_id,
          tekst: `Dokumentet "${a.tittel}" utløper om ${dagerIgjen} dager.`,
          lenke: "/attester",
        });
      }
    }

    res.status(200).json({ status: "OK", antall: attester.length });
  } catch (err: any) {
    console.error("Feil:", err);
    res.status(500).json({ error: err.message || "Ukjent feil" });
  }
}
