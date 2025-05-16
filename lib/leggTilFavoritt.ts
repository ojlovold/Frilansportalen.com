import { supabase } from "@/lib/supabaseClient";

/**
 * Legger til en annonse som favoritt for gitt bruker
 */
export async function leggTilFavoritt(brukerId: string, annonseId: string) {
  const { data, error } = await supabase.from("favoritter").insert([
    {
      bruker_id: brukerId,
      annonse_id: annonseId,
    },
  ]);

  if (error) {
    console.error("Feil ved lagring av favoritt:", error.message);
    return { error };
  }

  return { data };
}
