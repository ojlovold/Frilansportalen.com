useEffect(() => {
  const hent = async () => {
    const { data: egne } = await supabase
      .from("prosjekter")
      .select("*, deltakere:prosjektdeltakere(bruker_id, favoritt)")
      .eq("eier_id", brukerId);

    const { data: medlem } = await supabase
      .from("prosjektdeltakere")
      .select("prosjekt_id, favoritt")
      .eq("bruker_id", brukerId);

    const medlemIds = medlem?.map((m) => m.prosjekt_id) || [];

    const { data: ekstra } = await supabase
      .from("prosjekter")
      .select("*, deltakere:prosjektdeltakere(bruker_id, favoritt)")
      .in("id", medlemIds.length > 0 ? medlemIds : [""]);

    const samlet = [...(egne || []), ...(ekstra || [])];
    const unike = samlet.filter(
      (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    );

    const etiketter = new Set<string>();
    unike.forEach((p) =>
      (p.etiketter || []).forEach((e: string) => etiketter.add(e))
    );
    setAlleEtiketter(Array.from(etiketter));

    const { data: grupper } = await supabase
      .from("prosjektgrupper")
      .select("*")
      .eq("eier_id", brukerId);

    setAlleGrupper(grupper || []);
    setAlle(unike);
  };

  hent();
}, [brukerId]);
