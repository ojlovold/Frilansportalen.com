import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const idag = new Date();
  const om30dager = new Date();
  om30dager.setDate(idag.getDate() + 30);

  // 1. Hent attester som utløper innen 30 dager
  const { data: attester, error } = await supabase
    .from("attester")
    .select("*")
    .lt("utløper", om30dager.toISOString());

  if (error) return res.status(500).json({ error });

  for (const attest of attester || []) {
    // 2. Finnes varsel allerede?
    const { data: eksisterende } = await supabase
      .from("varsler")
      .select("*")
      .eq("bruker_id", attest.bruker_id)
      .eq("type", "attest")
      .eq("tekst", `Attesten "${attest.type}" utløper snart`)
      .maybeSingle();

    if (!eksisterende) {
      // 3. Opprett nytt varsel
      await supabase.from("varsler").insert([
        {
          bruker_id: attest.bruker_id,
          type: "attest",
          tekst: `Attesten "${attest.type}" utløper snart`,
          lenke: "/attester",
        },
      ]);
    }
  }

  res.status(200).json({ antall: attester?.length || 0 });
}
