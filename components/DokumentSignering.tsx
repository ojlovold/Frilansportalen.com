import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";
import { useState } from "react";

export default function DokumentSignering() {
  const rawUser = useUser();
  const brukerId = typeof rawUser === "object" && rawUser !== null && "id" in rawUser
    ? String((rawUser as any).id)
    : null;

  const [fil, setFil] = useState<File | null>(null);
  const [signatur, setSignatur] = useState("");
  const [status, setStatus] = useState<"klar" | "feil" | "lagret">("klar");

  const send = async () => {
    if (!fil || !brukerId || !signatur) return setStatus("feil");

    const sti = `signert/${brukerId}/${Date.now()}-${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("signerte-dokumenter")
      .upload(sti, fil);

    if (uploadError) return setStatus("feil");

    const { data: urlData } = supabase.storage
      .from("signerte-dokumenter")
      .getPublicUrl(sti);

    const { error: dbError } = await supabase.from("signaturer").insert([
      {
        bruker_id: brukerId,
        dokument_id: fil.name.replace(".pdf", ""),
        signatur,
        tidspunkt: new Date().toISOString(),
        url: urlData.publicUrl,
      },
    ]);

    if (dbError) return setStatus("feil");

    setStatus("lagret");
    setFil(null);
    setSignatur("");
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Signer dokument</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="w-full"
      />
      <input
        type="text"
        placeholder="Din signatur"
        value={signatur}
        onChange={(e) => setSignatur(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Last opp og signer
      </button>

      {status === "lagret" && <p className="text-green-600">Dokument signert!</p>}
      {status === "feil" && <p className="text-red-600">Noe gikk galt. Prøv igjen.</p>}
    </div>
  );
}
