import { supabase } from "@/lib/supabaseClient";

/**
 * Registrerer en ny annonse.
 * Automatisk pris: 0 kr (privat), 100 kr (firma), 500 kr (spam)
 */
export async function registrerAnnonse(annonse: any, bruker: any) {
  let pris = 0;
  const erFirma = bruker?.type === "firma";

  if (erFirma) pris = 100;

  try {
    // Sjekk etter duplikater (samme tittel + beskrivelse fra samme bruker)
    const { data: duplikater } = await supabase
      .from("annonser")
      .select("*")
      .eq("tittel", annonse.tittel)
      .eq("beskrivelse", annonse.beskrivelse)
      .eq("bruker_id", bruker.id);

    if (duplikater?.length >= 2) {
      pris = 500;

      await supabase
        .from("annonser")
        .update({
          er_spam: true,
          spam_teller: (duplikater[0].spam_teller || 1) + 1,
        })
        .eq("id", duplikater[0].id);
    }
  } catch (err) {
    console.warn("Duplikatsjekk feilet, men vi fortsetter.");
  }

  try {
    const { data, error } = await supabase.from("annonser").insert({
      ...annonse,
      bruker_id: bruker.id,
      pris,
      type: annonse.type || "Til salgs",
    });

    if (error) throw error;

    return { data, pris };
  } catch (error) {
    return { error };
  }
}
