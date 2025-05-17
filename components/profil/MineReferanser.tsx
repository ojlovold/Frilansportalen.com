import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Referanse {
  id: string;
  navn: string;
  kontaktinfo: string;
  relasjon: string;
}

export default function MineReferanser({ brukerId }: { brukerId: string }) {
  const [referanser, setReferanser] = useState<Referanse[]>([]);
  const [ny, setNy] = useState({ navn: "", kontaktinfo: "", relasjon: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("referanser")
        .select("*")
        .eq("bruker_id", brukerId)
        .order("opprettet");
      setReferanser(data || []);
    };
    hent();
  }, [brukerId]);

  const lagre = async () => {
    if (!ny.navn || !ny.kontaktinfo) return;
    const { error, data } = await supabase
      .from("referanser")
      .insert([{ bruker_id: brukerId, ...ny }])
      .select()
      .single();

    if (!error && data) {
      setReferanser((prev) => [...prev, data]);
      setNy({ navn: "", kontaktinfo: "", relasjon: "" });
      setStatus("Referanse lagret");
    }
  };

  const slett = async (id: string) => {
    await supabase.from("referanser").delete().eq("id", id);
    setReferanser((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-bold">Mine referanser</h2>

      <div className="space-y-2">
        <input
          placeholder="Navn"
          value={ny.navn}
          onChange={(e) => setNy({ ...ny, navn: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Kontaktinfo (e-post, telefon...)"
          value={ny.kontaktinfo}
          onChange={(e) => setNy({ ...ny, kontaktinfo: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Relasjon (kollega, leder...)"
          value={ny.relasjon}
          onChange={(e) => setNy({ ...ny, relasjon: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
          Lagre referanse
        </button>
        <p className="text-sm text-green-600">{status}</p>
      </div>

      <ul className="space-y-3 text-black">
        {referanser.map((r) => (
          <li key={r.id} className="border p-3 rounded">
            <p><strong>{r.navn}</strong></p>
            <p>{r.kontaktinfo}</p>
            <p>{r.relasjon}</p>
            <button onClick={() => slett(r.id)} className="text-red-600 underline text-sm mt-1">
              Slett
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
