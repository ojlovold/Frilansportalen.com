import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Dugnad {
  id: string;
  type: string;
  tittel: string;
  beskrivelse: string;
  kategori: string;
  sted: string;
  frist: string;
  opprettet: string;
}

export default function VisDugnader() {
  const [dugnader, setDugnader] = useState<Dugnad[]>([]);
  const [sok, setSok] = useState("");
  const [typeFilter, setTypeFilter] = useState("alle");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [stedFilter, setStedFilter] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("dugnader")
        .select("*")
        .order("opprettet", { ascending: false });

      setDugnader(data || []);
    };
    hent();
  }, []);

  const filtrert = dugnader.filter((d) => {
    const matchSok =
      [d.tittel, d.beskrivelse, d.kategori, d.sted]
        .join(" ")
        .toLowerCase()
        .includes(sok.toLowerCase());

    const matchType = typeFilter === "alle" || d.type === typeFilter;
    const matchKategori =
      !kategoriFilter || d.kategori.toLowerCase().includes(kategoriFilter.toLowerCase());
    const matchSted =
      !stedFilter || d.sted.toLowerCase().includes(stedFilter.toLowerCase());

    return matchSok && matchType && matchKategori && matchSted;
  });

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-bold">Dugnadsoppdrag</h2>

      <div className="grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Søk etter tittel, kategori, beskrivelse..."
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="alle">Alle typer</option>
          <option value="ber om hjelp">Ber om hjelp</option>
          <option value="tilbyr hjelp">Tilbyr hjelp</option>
        </select>
        <input
          type="text"
          placeholder="Kategori (valgfritt)"
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Sted (valgfritt)"
          value={stedFilter}
          onChange={(e) => setStedFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {filtrert.length === 0 ? (
        <p>Ingen dugnader funnet.</p>
      ) : (
        <ul className="space-y-4">
          {filtrert.map((d) => (
            <li key={d.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
              <p className="text-lg font-bold">{d.tittel}</p>
              <p className="text-sm text-gray-700">{d.beskrivelse}</p>
              <p className="text-sm">Kategori: {d.kategori || "-"}</p>
              <p className="text-sm">Sted: {d.sted || "-"}</p>
              <p className="text-sm">Frist: {d.frist ? new Date(d.frist).toLocaleDateString() : "-"}</p>
              <p className="text-sm text-gray-500">Type: {d.type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
