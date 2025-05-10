import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bruker = await supabase.auth.getUser();
  const id = bruker.data.user?.id;
  if (!id) return res.status(401).json({ error: "Ikke innlogget" });

  const år = new Date().getFullYear();

  const { data, error } = await supabase
    .from("fakturaer")
    .select("id")
    .eq("bruker_id", id)
    .gte("opprettet_dato", `${år}-01-01`)
    .lte("opprettet_dato", `${år}-12-31`);

  if (error) return res.status(500).json({ error: error.message });

  const nummer = `${år}-${(data?.length || 0) + 1}`.padStart(7, "0");
  res.status(200).json({ fakturanr: nummer });
}
