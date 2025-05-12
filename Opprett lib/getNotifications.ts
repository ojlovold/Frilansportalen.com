import supabase from "./supabaseClient";

export default async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("varsler")
    .select("*")
    .eq("user_id", userId)
    .order("opprettet", { ascending: false });

  if (error) {
    console.error("Feil ved henting av varsler:", error.message);
    return [];
  }

  return data || [];
}
