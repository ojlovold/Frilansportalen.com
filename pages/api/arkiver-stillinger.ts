import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const today = new Date().toISOString();

  const { error } = await supabase
    .from("stillinger")
    .update({ status: "utløpt" })
    .lt("frist", today)
    .eq("status", "aktiv");

  if (error) {
    return res.status(500).json({ error: "Kunne ikke oppdatere stillinger" });
  }

  return res.status(200).json({ status: "Stillinger oppdatert" });
}
