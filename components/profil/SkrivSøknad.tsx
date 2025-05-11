import { useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Props {
  brukerId: string;
  stillingId: string;
  stillingstittel: string;
}

export default function SkrivSøknad({ brukerId, stillingId, stillingstittel }: Props) {
  const [tekst, setTekst] = useState("");
  const [status, setStatus] = useState("");

  const sendSøknad = async () => {
    if (!tekst) return;

    const { error } = await supabase.from("søknader").insert([
      {
        bruker_id: brukerId,
        stilling_id: stillingId,
        stillingstittel,
        tekst,
      },
    ]);

    if (error) setStatus("Noe gikk galt.");
    else {
      setTekst("");
      setStatus("Søknaden er sendt!");
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Skriv søknad til: {stillingstittel}</h2>
      <textarea
        className="w-full p-2 border rounded min-h-[150px]"
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        placeholder="Skriv søknaden din her..."
      />
      <button onClick={sendSøknad} className="bg-black text-white px-4 py-2 rounded">
        Send søknad
      </button>
      <p>{status}</p>
    </div>
  );
}
