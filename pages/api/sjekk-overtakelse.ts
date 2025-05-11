import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const grense60 = new Date(Date.now() - 60 * 86400000).toISOString();

  const { data: bruker } = await supabase
    .from("profiler")
    .select("id, navn, arving, sist_aktiv")
    .eq("rolle", "admin")
    .lt("sist_aktiv", grense60)
    .single();

  if (!bruker?.arving) return res.status(200).json({ status: "Ingen overtakelse nødvendig" });

  // Gi arving admin-rettighet
  await supabase
    .from("profiler")
    .update({ rolle: "admin" })
    .eq("epost", bruker.arving);

  await fetch("/api/send-kopi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fra: "system",
      melding: `Du har nå fått overført Frilansportalen som ny administrator etter 60 dager inaktivitet.`,
    }),
  });

  res.status(200).json({ status: "Overføring utført til arving", arving: bruker.arving });
}
