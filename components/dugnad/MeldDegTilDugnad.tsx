import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function MeldDegTilDugnad({ dugnadId }: { dugnadId: string }) {
  const user = useUser();
  const [navn, setNavn] = useState("");
  const [kommentar, setKommentar] = useState("");
  const [status, setStatus] = useState("");

  const sendSvar = async () => {
    if (!navn || !dugnadId) {
      setStatus("Navn er påkrevd.");
      return;
    }

    const { error } = await supabase.from("dugnadsvar").insert({
      dugnad_id: dugnadId,
      navn,
      kommentar,
      bruker_id: user?.id || null,
    });

    if (error) {
      setStatus("Feil: " + error.message);
    } else {
      setStatus("Takk for svaret!");
      setNavn("");
      setKommentar("");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Meld deg på dugnaden</h2>

      <input
        type="text"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
        placeholder="Ditt navn"
        className="w-full p-2 mb-4 border rounded"
      />

      <textarea
        value={kommentar}
        onChange={(e) => setKommentar(e.target.value)}
        placeholder="Valgfri kommentar"
        className="w-full p-2 mb-4 border rounded"
        rows={3}
      />

      <button onClick={sendSvar} className="bg-black text-white px-4 py-2 rounded">
        Send svar
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
