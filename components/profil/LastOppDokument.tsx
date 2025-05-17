import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  userId: string;
};

export default function LastOppDokument({ userId }: Props) {
  const [fil, setFil] = useState<File | null>(null);
  const [type, setType] = useState("CV");
  const [utløper, setUtløper] = useState("");
  const [status, setStatus] = useState("");

  const lastOpp = async () => {
    if (!fil) return setStatus("Velg en fil før du laster opp.");

    const path = `${userId}/${Date.now()}_${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(path, fil);

    if (uploadError) {
      console.error("Opplasting feilet:", uploadError);
      return setStatus("Opplasting feilet");
    }

    const { data: urlData } = supabase.storage.from("dokumenter").getPublicUrl(path);
    const url = urlData?.publicUrl;

    if (!url) {
      return setStatus("Kunne ikke hente nedlastingslenke.");
    }

    const { error: dbError } = await supabase.from("dokumenter").insert([
      {
        bruker_id: userId,
        type,
        utløper: utløper || null,
        url,
      },
    ]);

    if (dbError) {
      console.error("Lagring i database feilet:", dbError);
      return setStatus("Feil ved lagring av metadata.");
    }

    setStatus("Dokument lastet opp!");
    setFil(null);
    setType("CV");
    setUtløper("");
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Last opp nytt dokument</h2>

      <input type="file" onChange={e => setFil(e.target.files?.[0] || null)} />

      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="block w-full p-2 border rounded"
      >
        <option value="CV">CV</option>
        <option value="Helseattest">Helseattest</option>
        <option value="Sertifikat">Sertifikat</option>
        <option value="Annet">Annet</option>
      </select>

      <input
        type="date"
        value={utløper}
        onChange={e => setUtløper(e.target.value)}
        className="block w-full border p-2 rounded"
      />

      <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
        Last opp
      </button>

      <p>{status}</p>
    </div>
  );
}
