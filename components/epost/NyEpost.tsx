// Hent mottakerens e-post
const { data: bruker } = await supabase
  .from("brukerprofiler")
  .select("epost")
  .eq("id", til)
  .single();

if (bruker?.epost) {
  await fetch("/api/send-varsling", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: bruker.epost,
      subject: "Ny melding i Frilansportalen",
      text: `Du har fått ny e-post fra en bruker. Logg inn for å lese den.`,
    }),
  });
}
