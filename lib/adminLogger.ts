// lib/adminLogger.ts
import { createClient } from "@supabase/supabase-js";
import { skalLoggeAlt } from "./skalLoggeAlt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function loggAdminHandling(epost: string, handling: string) {
  const tillatt = await skalLoggeAlt();
  if (!tillatt) return;

  await supabase.from("admin_logg").insert({
    epost,
    handling,
  });
}
