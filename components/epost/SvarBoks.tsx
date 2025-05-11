import { useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Props {
  svarFra: string;
  svarTil: string;
  originalEpostId: string;
}

export default function SvarBoks({ svarFra, svarTil, originalEpostId }: Props) {
  const [melding, setMelding] = useState("");
  const [status, setStatus] = useState("");

  const sendSvar = async () => {
    if (!melding) return;

    const { error } = await supabase.from("epost").insert([
      {
        fra: svarFra,
        til: svarTil,
        emne: "Svar på melding",
        innhold: melding,
        svar_paa: originalEpostId,
      },
    ]);

    setStatus(error ? "Feil ved sending" : "Svar sendt");
    if (!error) setMelding("");
  };

  return (
    <div className="mt-4 space-y-2">
      <textarea
        placeholder="Skriv svar..."
        className="w-full border p-2 rounded min-h-[80px]"
        value={melding}
        onChange={(e) => setMelding(e.target.value)}
      />
      <button onClick={sendSvar} className="bg-black text-white px-4 py-2 rounded">
        Send svar
      </button>
      <p>{status}</p>
    </div>
  );
}
