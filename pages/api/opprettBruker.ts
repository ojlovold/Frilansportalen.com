// pages/api/opprettBruker.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Sett opp klient med miljøvariabler
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔐 API-kjøring startet – Key:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST støttes" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("🚫 Mangler e-post eller passord");
    return res.status(400).json({ error: "Mangler e-post eller passord" });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.log("⚠️ Supabase createUser-feil:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("✅ Bruker opprettet:", data.user?.email);
  return res.status(200).json({ success: true, user: data.user });
}
