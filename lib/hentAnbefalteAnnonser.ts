import { supabase } from "@/lib/supabaseClient";
import { aiMatch } from "@/lib/aiMatch";

/**
 * Henter anbefalte annonser basert på tidligere søk
 */
export async function hentAnbefalteAnnonser(brukerId: string) {
  // Hent tidligere søkeord
  const { data: mønster } = await supabase
    .from("brukermønster")
    .select("verdi")
    .eq("bruker_id", brukerId)
    .eq("handling", "søk")
    .order("tidspunkt", { ascending: false })
    .limit(5);

  if (!mønster || mønster.length === 0) return [];

  // Lag synonym-baserte søkeord
  const søkefraser = mønster
    .flatMap((rad) => aiMatch(rad.verdi))
    .map((s) => s.toLowerCase());

  // Hent annonser som matcher noen av disse ordene
  const { data: annonser } = await supabase
    .from("annonser")
    .select("*");

  const relevante = (annonser || []).filter((a) => {
    const tekst = (a.tittel + a.beskrivelse).toLowerCase();
    return søkefraser.some((ord) => tekst.includes(ord));
  });

  return relevante.slice(0, 10);
}
