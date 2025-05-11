import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Fagfil {
  id: string;
  tittel: string;
  beskrivelse: string;
  kategori: string;
  url: string;
  filnavn: string;
  opplastet: string;
}

export default function Fagbibliotek() {
  const [filer, setFiler] = useState<Fagfil[]>([]);
  const [sok, setSok] = useState("");
  const [kategori, setKategori] = useState("Alle");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("fagbibliotek")
        .select("*")
        .order("opplastet", { ascending: false });
      setFiler(data || []);
    };
    hent();
  }, []);

  const filtrert = filer.filter((f) => {
    const matchKategori = kategori === "Alle" || f.kategori === kategori;
    const matchSok =
      f.tittel.toLowerCase().includes(sok.toLowerCase()) ||
      f.beskrivelse.toLowerCase().includes(sok.toLowerCase());
    return matchKategori && matchSok;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Fagbibliotek og skjemaer</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Søk etter tittel eller beskrivelse"
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Alle</option>
          <option>Generelt</option>
          <option>HMS</option>
          <option>Arbeidsrett</option>
          <option>Skjema</option>
          <option>Bransjestandard</option>
        </select>
      </div>

      {filtrert.length === 0 ? (
        <p>Ingen treff.</p>
      ) : (
        <ul className="space-y-4">
          {filtrert.map((f) => (
            <li key={f.id} className="border p-4 rounded bg-white text-black shadow-sm">
              <p><strong>{f.tittel}</strong></p>
              <p className="text-sm text-gray-700">{f.beskrivelse}</p>
              <p className="text-sm text-gray-500">Kategori: {f.kategori}</p>
              <a
                href={f.url}
                target="_blank"
                className="text-blue-600 underline text-sm mt-1 inline-block"
              >
                Last ned: {f.filnavn}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
