import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function NyEpost({ fraId }: { fraId: string }) {
  const [til, setTil] = useState("");
  const [emne, setEmne] = useState("");
  const [innhold, setInnhold] = useState("");
  const [status, setStatus] = useState("");

  const send = async () => {
    if (!til || !innhold) {
      setStatus("Mottaker og innhold må fylles ut.");
      return;
    }

    const { error } = await supabase.from("epost").insert([
      {
        fra: fraId,
        til,
        emne,
        innhold,
        vedlegg: null, // kan utvides senere
      },
    ]);

    setStatus(error ? "Feil ved sending" : "E-post sendt!");
    if (!error) {
      setTil("");
      setEmne("");
      setInnhold("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Send ny e-post</h2>
      <input
        type="text"
        placeholder="Mottaker bruker-ID"
        value={til}
        onChange={(e) => setTil(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Emne"
        value={emne}
        onChange={(e) => setEmne(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Meldingstekst"
        value={innhold}
        onChange={(e) => setInnhold(e.target.value)}
        className="w-full border p-2 rounded min-h-[120px]"
      />
      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Send e-post
      </button>
      <p>{status}</p>
    </div>
  );
}
