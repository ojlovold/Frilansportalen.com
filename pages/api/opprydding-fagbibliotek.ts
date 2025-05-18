// pages/api/opprydding-fagbibliotek.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { data: fagfiler } = await supabase.from("fagbibliotek").select("id, url");

  if (!fagfiler) return res.status(500).json({ error: "Ingen data funnet" });

  let slettet = 0;

  for (const fil of fagfiler) {
    try {
      const resp = await fetch(fil.url, { method: "HEAD" });

      if (!resp.ok) {
        await supabase.from("fagbibliotek").delete().eq("id", fil.id);
        slettet++;
      }
    } catch {
      await supabase.from("fagbibliotek").delete().eq("id", fil.id);
      slettet++;
    }
  }

  res.status(200).json({ status: "ok", slettet });
}
