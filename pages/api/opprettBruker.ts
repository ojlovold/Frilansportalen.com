// pages/api/opprettBruker.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("➡️ API-kall mottatt");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Kun POST støttes" });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("🔐 Supabase klient opprettet");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Mangler e-post eller passord" });
    }

    console.log("📩 Oppretter bruker:", email);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Feil fra Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Bruker opprettet:", data.user?.email);
    return res.status(200).json({ success: true, user: data.user });
  } catch (err: any) {
    console.error("💥 API-krasj:", err.message || err);
    return res.status(500).json({ error: "Intern feil – se logg" });
  }
}
