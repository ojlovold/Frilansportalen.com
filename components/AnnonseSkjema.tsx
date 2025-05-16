import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { registrerAnnonse } from "@/lib/registrerAnnonse";

export default function AnnonseSkjema({ bruker }: { bruker: any }) {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [pris, setPris] = useState(0);
  const [type, setType] = useState("Til salgs");
  const [bilde, setBilde] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const lastOppBilde = async () => {
    if (!bilde) return null;

    const filnavn = `${Date.now()}_${bilde.name}`;
    const { data, error } = await supabase.storage
      .from("annonser-bilder")
      .upload(filnavn, bilde);

    if (error) {
      console.error("Feil ved bildeopplasting:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("annonser-bilder")
      .getPublicUrl(filnavn);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Lagrer...");

    const bildeUrl = await lastOppBilde();

    const annonse = {
      tittel,
      beskrivelse,
      pris,
      type,
      bilder: bildeUrl ? [bildeUrl] : [],
    };

    const { data, error } = await registrerAnnonse(annonse, bruker);

    if (error) {
      setStatus("Feil ved lagring");
    } else {
      setStatus("Annonse publisert!");
      setTittel("");
      setBeskrivelse("");
      setPris(0);
      setType("Til salgs");
      setBilde(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-2">Legg ut annonse</h2>

      <input
        type="text"
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        placeholder="Beskrivelse"
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        className="w-full border p-2 rounded"
        rows={4}
        required
      />

      <input
        type="number"
        placeholder="Pris (0 for gratis)"
        value={pris}
        onChange={(e) => setPris(Number(e.target.value))}
        className="w-full border p-2 rounded"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option>Til salgs</option>
        <option>Gis bort</option>
        <option>Ønskes</option>
        <option>Ønskes kjøpt</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBilde(e.target.files?.[0] || null)}
        className="w-full"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Publiser
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}
