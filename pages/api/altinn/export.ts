// pages/api/altinn/export.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  const { data, error } = await supabase
    .from("bruker_utgifter")
    .select("*")
    .eq("bruker_id", user.id)
    .order("dato", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const exportData = {
    bruker_id: user.id,
    eksportert: new Date().toISOString(),
    utgifter: data.map((rad) => ({
      id: rad.id,
      dato: rad.dato,
      tittel: rad.tittel,
      valuta: rad.valuta,
      belop: parseFloat(rad.belop),
      nok: parseFloat(rad.nok),
      fil_url: rad.fil_url,
    })),
    sum_nok: data.reduce((acc, rad) => acc + parseFloat(rad.nok || 0), 0),
  };

  res.status(200).json(exportData);
}
