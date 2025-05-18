import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProsjektEtiketter({ prosjektId }: { prosjektId: string }) {
  const [etiketter, setEtiketter] = useState<string[]>([]);
  const [ny, setNy] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjekter")
        .select("etiketter")
        .eq("id", prosjektId)
        .single();

      setEtiketter(data?.etiketter || []);
    };

    hent();
  }, [prosjektId]);

  const leggTil = async () => {
    if (!ny.trim() || etiketter.includes(ny)) return;

    const oppdatert = [...etiketter, ny.trim()];
    const { error } = await supabase
      .from("prosjekter")
      .update({ etiketter: oppdatert })
      .eq("id", prosjektId);

    if (!error) {
      setEtiketter(oppdatert);
      setNy("");
      setStatus("Etikett lagt til");
    }
  };

  const fjern = async (tekst: string) => {
    const oppdatert = etiketter.filter((e) => e !== tekst);
    const { error } = await supabase
      .from("prosjekter")
      .update({ etiketter: oppdatert })
      .eq("id", prosjektId);

    if (!error) {
      setEtiketter(oppdatert);
      setStatus("Etikett fjernet");
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <h3 className="text-lg font-bold">Etiketter / prosjektgrupper</h3>

      <div className="flex flex-wrap gap-2">
        {etiketter.map((e) => (
          <span
            key={e}
            className="bg-yellow-200 text-black px-2 py-1 rounded text-sm flex items-center gap-1"
          >
            {e}
            <button onClick={() => fjern(e)} className="text-xs text-red-600">&times;</button>
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Ny etikett"
          value={ny}
          onChange={(e) => setNy(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={leggTil} className="bg-black text-white px-4 py-2 rounded">
          Legg til
        </button>
      </div>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
