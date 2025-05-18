import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NyOppgave({ prosjektId }: { prosjektId: string }) {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [frist, setFrist] = useState("");
  const [status, setStatus] = useState("");

  const lagre = async () => {
    if (!tittel) {
      setStatus("Tittel må fylles ut.");
      return;
    }

    const { error } = await supabase.from("prosjektoppgaver").insert([
      {
        prosjekt_id: prosjektId,
        tittel,
        beskrivelse,
        frist,
      },
    ]);

    setStatus(error ? "Feil ved lagring" : "Oppgave lagt til!");
    if (!error) {
      setTittel("");
      setBeskrivelse("");
      setFrist("");
    }
  };

  return (
    <div className="space-y-3 bg-white p-4 border rounded mt-6">
      <h3 className="text-lg font-bold">Legg til ny oppgave</h3>
      <input
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Beskrivelse"
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        value={frist}
        onChange={(e) => setFrist(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre oppgave
      </button>
      <p>{status}</p>
    </div>
  );
}
