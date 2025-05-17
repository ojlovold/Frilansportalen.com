import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Fakturainnstillinger({ brukerId }: { brukerId: string }) {
  const [konto, setKonto] = useState("");
  const [epost, setEpost] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("brukerprofiler")
        .select("kontonummer, fakturaepost")
        .eq("id", brukerId)
        .single();

      if (data) {
        setKonto(data.kontonummer || "");
        setEpost(data.fakturaepost || "");
      }
    };

    hent();
  }, [brukerId]);

  const lagre = async () => {
    const { error } = await supabase.from("brukerprofiler").update({
      kontonummer: konto,
      fakturaepost: epost,
    }).eq("id", brukerId);

    setStatus(error ? "Feil ved lagring" : "Lagret!");
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold">Fakturainnstillinger</h2>

      <input
        placeholder="Kontonummer"
        value={konto}
        onChange={(e) => setKonto(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="E-post for faktura"
        value={epost}
        onChange={(e) => setEpost(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre
      </button>

      {status && <p className="text-sm text-green-600">{status}</p>}
    </div>
  );
}
