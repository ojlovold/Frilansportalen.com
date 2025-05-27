// lib/skalLoggeAlt.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function skalLoggeAlt(): Promise<boolean> {
  const { data } = await supabase.from("admin_config").select("logg_alt").single();
  return data?.logg_alt ?? false;
}
