import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  eierId: string;
  onVelg: (gruppeId: string) => void;
}

export default function VelgProsjektGruppe({ eierId, onVelg }: Props) {
  const [grupper, setGrupper] = useState<any[]>([]);
  const [ny, setNy] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjektgrupper")
        .select("*")
        .eq("eier_id", eierId)
        .order("opprettet", { ascending: false });

      setGrupper(data || []);
    };

    hent();
  }, [eierId]);

  const opprett = async () => {
    if (!ny.trim()) return;

    const { data, error } = await supabase
      .from("prosjektgrupper")
      .insert([{ navn: ny.trim(), eier_id: eierId }])
      .select()
      .single();

    if (!error && data) {
      setGrupper((prev) => [data, ...prev]);
      onVelg(data.id);
      setNy("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold">Arbeidsgruppe / klient</label>
      <select
        className="w-full border p-2 rounded"
        onChange={(e) => onVelg(e.target.value)}
      >
        <option value="">Velg gruppe</option>
        {grupper.map((g) => (
          <option key={g.id} value={g.id}>
            {g.navn}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          type="text"
          value={ny}
          onChange={(e) => setNy(e.target.value)}
          placeholder="Ny gruppe"
          className="w-full border p-2 rounded"
        />
        <button onClick={opprett} className="bg-black text-white px-4 py-2 rounded">
          Opprett
        </button>
      </div>
    </div>
  );
}
