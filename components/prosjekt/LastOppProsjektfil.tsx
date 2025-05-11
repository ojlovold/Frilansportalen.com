import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface Prosjektfil {
  id: string;
  filnavn: string;
  url: string;
  opplastet: string;
  opplaster_id: string;
}

export default function LastOppProsjektfil({ prosjektId }: { prosjektId: string }) {
  const user = useUser();
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [filer, setFiler] = useState<Prosjektfil[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjektfiler")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .order("opplastet", { ascending: false });

      setFiler(data || []);
    };

    hent();
  }, [prosjektId]);

  const lastOpp = async () => {
    if (!fil || !user) return;

    const path = `prosjekter/${prosjektId}/${Date.now()}_${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("prosjektfiler")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Feil ved opplasting");
      return;
    }

    const url = supabase.storage.from("prosjektfiler").getPublicUrl(path).data.publicUrl;

    const { error } = await supabase.from("prosjektfiler").insert([
      {
        prosjekt_id: prosjektId,
        opplaster_id: user.id,
        filnavn: fil.name,
        url,
      },
    ]);

    setStatus(error ? "Kunne ikke lagre fil" : "Fil lastet opp!");
    if (!error) {
      setFil(null);
      const { data: oppdatert } = await supabase
        .from("prosjektfiler")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .order("opplastet", { ascending: false });

      setFiler(oppdatert || []);
    }
  };

  return (
    <div class
