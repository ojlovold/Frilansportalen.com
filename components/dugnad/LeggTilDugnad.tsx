import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function LeggTilDugnad() {
  const user = useUser();
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [status, setStatus] = useState("");

  const lagre = async () => {
    if (!user) return;
    if (!tittel || !beskrivelse) {
      setStatus("Tittel og beskrivelse er påkrevd.");
      return;
    }

    const { error } = await supabase.from("dugnader").insert({
      tittel,
      beskrivelse,
      bruker_id: user.id,
    });

    if (error) {
      setStatus("Feil: " + error.message);
    } else {
      setStatus("Dugnad opprettet!");
      setTittel("");
      setBeskrivelse("");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Legg til dugnad</h2>

      <input
        type="text"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        placeholder="Tittel"
        className="w-full p-2 mb-4 border rounded"
      />

      <textarea
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        placeholder="Beskrivelse"
        className="w-full p-2 mb-4 border rounded"
        rows={4}
      />

      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
