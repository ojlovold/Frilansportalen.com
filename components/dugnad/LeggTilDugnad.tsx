import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function LeggTilDugnad() {
  const [type, setType] = useState("ber om hjelp");
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [kategori, setKategori] = useState("");
  const [sted, setSted] = useState("");
  const [frist, setFrist] = useState("");
  const [status, setStatus] = useState("");

  const lagre = async () => {
    if (!tittel || !beskrivelse) {
      setStatus("Tittel og beskrivelse må fylles ut.");
      return;
    }

    const { error } = await supabase.from("dugnader").insert([
      {
        type,
        tittel,
        beskrivelse,
        kategori,
        sted,
        frist,
      },
    ]);

    setStatus(error ? "Kunne ikke lagre dugnad" : "Dugnad publisert!");
    if (!error) {
      setType("ber om hjelp");
      setTittel("");
      setBeskrivelse("");
      setKategori("");
      setSted("");
      setFrist("");
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded shadow">
      <h2 className="text-lg font-bold">Legg ut dugnadsoppdrag</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="ber om hjelp">Jeg ber om hjelp</option>
        <option value="tilbyr hjelp">Jeg tilbyr hjelp</option>
      </select>

      <input
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Beskrivelse av oppdraget"
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Kategori (f.eks. snømåking, flyttehjelp)"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Sted/by/område"
        value={sted}
        onChange={(e) => setSted(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        value={frist}
        onChange={(e) => setFrist(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Publiser dugnad
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
