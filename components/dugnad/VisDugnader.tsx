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

export default function VisDugnader({ filterType }: { filterType?: string }) {
  const [dugnader, setDugnader] = useState<Dugnad[]>([]);
  const [sok, setSok] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [stedFilter, setStedFilter] = useState("");

  useEffect(() => {
    const hent = async () => {
      let query = supabase.from("dugnader").select("*");

      if (filterType) {
        query = query.eq("type", filterType);
      }

      const { data } = await query.order("opprettet", { ascending: false });
      setDugnader(data || []);
    };

    hent();
  }, [filterType]);

  const filtrert = dugnader.filter((d) => {
    const matchSok =
      [d.tittel, d.beskrivelse, d.kategori, d.sted]
        .join(" ")
        .toLowerCase()
        .includes(sok.toLowerCase());

    const matchKategori =
      !kategoriFilter || d.kategori.toLowerCase().includes(kategoriFilter.toLowerCase());

    const matchSted =
      !stedFilter || d.sted.toLowerCase().includes(stedFilter.toLowerCase());

    return matchSok && matchKategori && matchSted;
  });

  return (
    <div className="space-y-6 mt-6">
      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Søk etter tittel, beskrivelse..."
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Kategori (valgfritt)"
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Sted/by/område"
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
