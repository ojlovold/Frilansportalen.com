import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error("❌ MANGLET miljøvariabler");
      return res.status(500).json({ error: "Miljøvariabler mangler i runtime" });
    }

    console.log("✅ Miljøvariabler funnet, starter Supabase-klient");

    const supabase = createClient(url, key);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Kun POST støttes" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Mangler e-post eller passord" });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Supabase createUser-feil:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Bruker opprettet:", data.user?.email);
    return res.status(200).json({ success: true, user: data.user });
  } catch (err: any) {
    console.error("💥 Full API-feil:", err.message || err);
    return res.status(500).json({ error: "Intern serverfeil – se logg" });
  }
}
