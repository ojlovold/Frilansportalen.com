import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function LastOppAttest({ brukerId }: { brukerId: string }) {
  const [type, setType] = useState("Helseattest");
  const [utløper, setUtløper] = useState("");
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const lastOpp = async () => {
    if (!fil || !utløper || !type) {
      setStatus("Alle felter må fylles ut.");
      return;
    }

    const path = `${brukerId}/${Date.now()}_${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("attester")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Opplasting feilet");
      return;
    }

    const url = supabase.storage.from("attester").getPublicUrl(path).data.publicUrl;

    const { error } = await supabase.from("attester").insert([
      {
        bruker_id: brukerId,
        type,
        utløper,
        filnavn: fil.name,
        url,
      },
    ]);

    setStatus(error ? "Kunne ikke lagre" : "Attest lastet opp!");
    if (!error) {
      setFil(null);
      setType("Helseattest");
      setUtløper("");
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 border rounded shadow">
      <h2 className="text-xl font-bold text-black">Last opp attest / dokument</h2>

      <select
        className="w-full border p-2 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option>Helseattest</option>
        <option>Førerkort</option>
        <option>Sertifikat</option>
        <option>HMS</option>
        <option>Annet</option>
      </select>

      <input
        type="date"
        value={utløper}
        onChange={(e) => setUtløper(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="file"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="w-full border p-2 rounded"
        accept=".pdf,.jpg,.png,.doc,.docx"
      />

      <button
        onClick={lastOpp}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Last opp
      </button>

      <p>{status}</p>
    </div>
  );
}
