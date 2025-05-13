import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function DokumentSignering({ brukerId }: { brukerId: string }) {
  const [fil, setFil] = useState<File | null>(null);
  const [signatur, setSignatur] = useState("");
  const [status, setStatus] = useState<"klar" | "sender" | "ferdig" | "feil">("klar");

  const send = async () => {
    if (!fil || !signatur || !brukerId) return setStatus("feil");

    setStatus("sender");

    const filnavn = `${brukerId}/${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("signerte-dokumenter")
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) {
      console.error("Feil ved opplasting:", uploadError.message);
      return setStatus("feil");
    }

    const dokumentId = fil.name.replace(".pdf", "");

    const { error: insertError } = await supabase.from("signaturer").insert([
      {
        bruker_id: brukerId,
        dokument_id: dokumentId,
        signatur,
      },
    ]);

    if (insertError) {
      console.error("Feil ved lagring:", insertError.message);
      return setStatus("feil");
    }

    setFil(null);
    setSignatur("");
    setStatus("ferdig");
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Signer dokument</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="block w-full border p-2 rounded"
      />

      <input
        type="text"
        value={signatur}
        onChange={(e) => setSignatur(e.target.value)}
        placeholder="Skriv signatur"
        className="block w-full border p-2 rounded"
      />

      <button
        onClick={send}
        className="bg-black text-white px-4 py-2 rounded text-sm"
      >
        Send
      </button>

      {status === "ferdig" && <p className="text-green-600 text-sm">Signering lagret!</p>}
      {status === "feil" && <p className="text-red-600 text-sm">Noe gikk galt.</p>}
    </div>
  );
}
