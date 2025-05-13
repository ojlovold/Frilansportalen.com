// lib/loggVisning.ts
import supabase from "./supabaseClient";

export default async function loggVisning(
  bruker_id: string,
  objekt_id: string,
  type: string
) {
  await supabase.from("visningslogg").insert([
    {
      bruker_id,
      objekt_id,
      type,
      tidspunkt: new Date().toISOString(),
    },
  ]);
}
