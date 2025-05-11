import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function LastOppFagfil() {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [kategori, setKategori] = useState("Generelt");
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const lastOpp = async () => {
    if (!fil || !tittel) {
      setStatus("Tittel og fil er påkrevd.");
      return;
    }

    const path = `fag/${Date.now()}_${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("fagbibliotek")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Opplasting feilet");
      return;
    }

    const url = supabase.storage.from("fagbibliotek").getPublicUrl(path).data.publicUrl;

    const { error } = await supabase.from("fagbibliotek").insert([
      {
        tittel,
        beskrivelse,
        kategori,
        url,
        filnavn: fil.name,
      },
    ]);

    setStatus(error ? "Kunne ikke lagre" : "Fagfil lastet opp!");
    if (!error) {
      setTittel("");
      setBeskrivelse("");
      setFil(null);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 border rounded shadow">
      <h2 className="text-xl font-bold text-black">Last opp fagfil / skjema</h2>

      <input
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Beskrivelse"
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option>Generelt</option>
        <option>HMS</option>
        <option>Arbeidsrett</option>
        <option>Skjema</option>
        <option>Bransjestandard</option>
      </select>

      <input
        type="file"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="w-full border p-2 rounded"
        accept=".pdf,.doc,.docx,.jpg,.png"
      />

      <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
        Last opp
      </button>

      <p>{status}</p>
    </div>
  );
}
