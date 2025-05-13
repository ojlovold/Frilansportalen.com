// components/DokumentSignering.tsx
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";
import { useState } from "react";

export default function DokumentSignering() {
  const { user } = useUser() ?? {}; // Bruk destrukturering trygt
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState<"klar" | "laster" | "feil" | "ok">("klar");

  const signer = async () => {
    if (!fil || !user?.id) return;
    setStatus("laster");

    const path = `signering/${user.id}/${fil.name}`;
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

    const { error: dbError } = await supabase.from("signaturer").insert([
      {
        bruker_id: user.id,
        dokument_id: fil.name.replace(".pdf", ""),
        signatur: "signert",
        url: urlData.publicUrl,
      },
    ]);

    if (dbError) {
      console.error(dbError);
      setStatus("feil");
    } else {
      setFil(null);
      setStatus("ok");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Last opp og signer dokument</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="w-full"
      />
      <button
        onClick={signer}
        className="bg-black text-white px-4 py-2 rounded text-sm"
        disabled={!fil || status === "laster"}
      >
        {status === "laster" ? "Laster opp..." : "Signer"}
      </button>
      {status === "ok" && <p className="text-green-600">Dokument signert!</p>}
      {status === "feil" && <p className="text-red-600">Noe gikk galt.</p>}
    </div>
  );
}
