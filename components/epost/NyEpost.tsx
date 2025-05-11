await supabase.from("varsler").insert([
  {
    bruker_id: til,
    type: "epost",
    tekst: `Ny e-post fra ${fraId}`,
    lenke: "/epost",
  },
]);
