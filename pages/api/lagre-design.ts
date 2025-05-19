import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Kun POST er tillatt" });

  const { bakgrunn, tekst } = req.body;

  if (!bakgrunn || !tekst) {
    return res.status(400).json({ error: "Mangler bakgrunn eller tekst" });
  }

  // Sørg for at det kun finnes én rad i tabellen (id = 1)
  const { error: updateError } = await supabase
    .from("designinnstillinger")
    .upsert([{ id: 1, bakgrunnsfarge: bakgrunn, tekstfarge: tekst }], { onConflict: "id" });

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.status(200).json({ message: "Design lagret" });
}
