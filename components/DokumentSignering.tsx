import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";

export default function DokumentSignering() {
  const rawUser = useUser();
  const user: User | null =
    rawUser && typeof rawUser === "object" && rawUser !== null && "id" in rawUser
      ? (rawUser as User)
      : null;

  const [fil, setFil] = useState<File | null>(null);
  const [signatur, setSignatur] = useState("");

  const send = async () => {
    if (!fil || !user) return;

    const filnavn = `signert/${user.id}/${Date.now()}-${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("signerte-dokumenter")
      .upload(filnavn, fil, {
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error("Opplasting feilet:", uploadError);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("signerte-dokumenter")
      .getPublicUrl(filnavn);

    const { error: dbError } = await supabase.from("signaturer").insert([
      {
        bruker_id: user.id,
        dokument_id: fil.name.replace(".pdf", ""),
        signatur,
        tidspunkt: new Date().toISOString(),
        url: urlData.publicUrl,
      },
    ]);

    if (dbError) {
      console.error("DB-feil:", dbError);
    } else {
      setFil(null);
      setSignatur("");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Signer et dokument</h2>
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
        className="w-full p-2 border rounded"
      />
      <button
        onClick={send}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Last opp og signer
      </button>
    </div>
  );
}
