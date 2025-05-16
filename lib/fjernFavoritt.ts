import { supabase } from "@/lib/supabaseClient";

/**
 * Fjerner en annonse som favoritt for gitt bruker
 */
export async function fjernFavoritt(brukerId: string, annonseId: string) {
  const { error } = await supabase
    .from("favoritter")
    .delete()
    .match({ bruker_id: brukerId, annonse_id: annonseId });

  if (error) {
    console.error("Feil ved fjerning av favoritt:", error.message);
    return { error };
  }

  return { success: true };
}
