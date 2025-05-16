import { supabase } from "@/lib/supabaseClient";

/**
 * Registrerer en ny annonse med automatisk prislogikk og spamdeteksjon.
 * - Privatperson: 0 kr
 * - Firma: 100 kr
 * - Spam (samme annonse > 2 ganger): 500 kr
 */
export async function registrerAnnonse(annonse: any, bruker: any) {
  let pris = 0;
  const erFirma = bruker?.type === "firma";

  if (erFirma) pris = 100;

  try {
    const { data: duplikater = [], error } = await supabase
      .from("annonser")
      .select("*")
      .eq("tittel", annonse.tittel)
      .eq("beskrivelse", annonse.beskrivelse)
      .eq("bruker_id", bruker.id);

    if (Array.isArray(duplikater) && duplikater.length >= 2) {
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
    console.warn("Duplikatsjekk feilet, men fortsetter registrering.");
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
