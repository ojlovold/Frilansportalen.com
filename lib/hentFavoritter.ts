import supabase from "@/lib/supabaseClient";

/**
 * Henter favorittobjekter for en bruker.
 * @param brukerId - ID til innlogget bruker
 * @param type - "stilling", "tjeneste", "gjenbruk", etc.
 */
export async function hentFavoritter(brukerId: string, type: string) {
  const { data, error } = await supabase
    .from("favoritter")
    .select("*")
    .eq("bruker_id", brukerId)
    .eq("type", type);

  if (error) {
    console.error("Feil ved henting av favoritter:", error.message);
    return [];
  }

  return data || [];
}
