import { supabase } from "./supabaseClient";

/**
 * Sjekker om brukeren med gitt ID har premium.
 */
export async function brukerHarPremium(brukerId: string): Promise<boolean> {
  if (!brukerId) return false;

  const { data } = await supabase
    .from("profiler")
    .select("premium")
    .eq("id", brukerId)
    .single();

  return data?.premium === true;
}
