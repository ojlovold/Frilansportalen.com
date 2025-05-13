import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function DokumentSignering({ brukerId }: { brukerId: string }) {
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState<"klar" | "laster" | "ferdig" | "feil">("klar");

  const lastOpp = async () => {
    if (!fil || !brukerId) return;
    setStatus("laster");

    const path = `signerte-dokumenter/${brukerId}/${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("signerte-dokumenter")
      .upload(path, fil, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setStatus("feil");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("signerte-dokumenter")
      .getPublicUrl(path);

    await supabase.from("signaturer").insert([
      {
        bruker_id: brukerId,
        dokument_id: fil.name.replace(".pdf", ""),
        sign
