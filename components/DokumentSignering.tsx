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
        signatur: "Signert elektronisk",
        tidspunkt: new Date().toISOString(),
      },
    ]);

    setFil(null);
    setStatus("ferdig");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Signer dokument</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={lastOpp}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Last opp og signer
      </button>
      {status === "ferdig" && <p className="text-green-600 mt-2">Dokument signert!</p>}
      {status === "feil" && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
    </div>
  );
}
