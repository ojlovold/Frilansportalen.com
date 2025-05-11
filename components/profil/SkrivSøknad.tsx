const sendSøknad = async () => {
  if (!tekst) return;

  const { data: eksisterende } = await supabase
    .from("søknader")
    .select("id")
    .eq("bruker_id", brukerId)
    .eq("stilling_id", stillingId)
    .maybeSingle();

  if (eksisterende) {
    setStatus("Du har allerede søkt på denne stillingen.");
    return;
  }

  const { error } = await supabase.from("søknader").insert([
    {
      bruker_id: brukerId,
      stilling_id: stillingId,
      stillingstittel,
      tekst,
    },
  ]);

  if (error) setStatus("Noe gikk galt.");
  else {
    setTekst("");
    setStatus("Søknaden er sendt!");
  }
};
