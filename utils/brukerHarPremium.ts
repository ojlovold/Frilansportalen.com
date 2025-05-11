import { supabase } from "./supabaseClient";

export async function brukerHarPremium(): Promise<boolean> {
  const bruker = await supabase.auth.getUser();
  const id = bruker.data.user?.id;
  if (!id) return false;

  const { data } = await supabase
    .from("profiler")
    .select("premium")
    .eq("id", id)
    .single();

  return data?.premium === true;
}
