import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function DokumentSignering() {
  const rawUser = useUser();
  const bruker = typeof rawUser === "object" && rawUser !== null && "id" in rawUser
    ? (rawUser as User)
    : null;

  const [fil, setFil] = useState<File | null>(null);
  const [melding, setMelding] = useState("");

  const signer = async () => {
    if (!fil || !bruker?.id) return;

    const filnavn = `${bruker.id}/${fil.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from("signerte-dokumenter")
      .upload(filnavn, fil, { upsert: true });

    if (uploadError) {
      setMelding("Feil under opplasting");
      return;
    }

    const { error: dbError } = await supabase.from("signaturer").insert({
      bruker_id: bruker.id,
      dokument_id: fil.name.replace(".pdf", ""),
      signatur: "OK", // evt. hent signatur fra input hvis du ønsker
    });

    if (dbError) {
      setMelding("Feil under lagring av signatur");
    } else {
      setMelding("Dokument signert og lagret.");
      setFil(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Signer dokument</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="mb-3"
      />
      <button
        onClick={signer}
        className="bg-black text-white px-4 py-2 rounded text-sm"
      >
        Last opp og signer
      </button>

      {melding && <p className="mt-2 text-sm text-gray-700">{melding}</p>}
    </div>
  );
}
