const oppdaterStatus = async (id: string, nyStatus: string) => {
  const søknad = søknader.find((s) => s.id === id);
  if (!søknad) return;

  const { error } = await supabase
    .from("søknader")
    .update({ status: nyStatus })
    .eq("id", id);

  if (!error) {
    setSøknader((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nyStatus } : s))
    );
    setStatus("Status oppdatert");

    // Opprett varsel
    await supabase.from("varsler").insert([
      {
        bruker_id: søknad.bruker_id,
        type: "søknad",
        tekst: `Søknadsstatus oppdatert: ${nyStatus} for stillingen "${søknad.stilling?.tittel || "ukjent"}"`,
        lenke: `/profil`,
      },
    ]);
  }
};
