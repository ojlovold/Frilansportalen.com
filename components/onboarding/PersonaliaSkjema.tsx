import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function PersonaliaSkjema({ brukerId }: { brukerId: string }) {
  const [navn, setNavn] = useState("");
  const [alder, setAlder] = useState("");
  const [kjonn, setKjonn] = useState("");
  const [adresse, setAdresse] = useState("");
  const [lagret, setLagret] = useState(false);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("brukerprofiler")
        .select("*")
        .eq("id", brukerId)
        .single();

      if (data) {
        setNavn(data.navn || "");
        setAlder(data.alder || "");
        setKjonn(data.kjonn || "");
        setAdresse(data.adresse || "");
        setLagret(true); // allerede fylt ut
      }
    };
    hent();
  }, [brukerId]);

  const lagre = async () => {
    const { error } = await supabase.from("brukerprofiler").upsert({
      id: brukerId,
      navn,
      alder,
      kjonn,
      adresse,
    });

    if (!error) setLagret(true);
  };

  if (lagret) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 p-6 rounded mb-6 space-y-4">
      <h2 className="text-xl font-bold text-black">Fyll inn personalia</h2>

      <input
        placeholder="Fullt navn"
        className="w-full border p-2 rounded"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
      />
      <input
        placeholder="Alder"
        type="number"
        className="w-full border p-2 rounded"
        value={alder}
        onChange={(e) => setAlder(e.target.value)}
      />
      <select
        className="w-full border p-2 rounded"
        value={kjonn}
        onChange={(e) => setKjonn(e.target.value)}
      >
        <option value="">Velg kjønn</option>
        <option value="Mann">Mann</option>
        <option value="Kvinne">Kvinne</option>
        <option value="Annet">Annet</option>
      </select>
      <input
        placeholder="Adresse"
        className="w-full border p-2 rounded"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
      />

      <button
        onClick={lagre}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Lagre
      </button>
    </div>
  );
}
