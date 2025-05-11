import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import VelgProsjektGruppe from "./VelgProsjektGruppe";

export default function OpprettProsjekt({ eierId }: { eierId: string }) {
  const [navn, setNavn] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [frist, setFrist] = useState("");
  const [gruppeId, setGruppeId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const lagre = async () => {
    if (!navn) {
      setStatus("Navn må fylles ut.");
      return;
    }

    const { error } = await supabase.from("prosjekter").insert([
      {
        navn,
        beskrivelse,
        frist,
        eier_id: eierId,
        gruppe_id: gruppeId,
      },
    ]);

    setStatus(error ? "Feil ved opprettelse" : "Prosjekt opprettet!");
    if (!error) {
      setNavn("");
      setBeskrivelse("");
      setFrist("");
      setGruppeId(null);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 border rounded shadow">
      <h2 className="text-xl font-bold text-black">Opprett nytt prosjekt</h2>

      <input
        placeholder="Prosjektnavn"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
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

      <VelgProsjektGruppe eierId={eierId} onVelg={setGruppeId} />

      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre prosjekt
      </button>

      <p>{status}</p>
    </div>
  );
}
