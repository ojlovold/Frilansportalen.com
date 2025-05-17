import { supabase } from "@/utils/supabase";

export async function brukerHarPremium(brukerId: string): Promise<boolean> {
  if (!brukerId) return false;

  const { data, error } = await supabase
    .from("premium")
    .select("id")
    .eq("bruker_id", brukerId)
    .single();

  return !!data && !error;
}
