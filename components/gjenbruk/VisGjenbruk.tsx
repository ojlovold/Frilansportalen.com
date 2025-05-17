import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Gjenbruk {
  id: string;
  type: string;
  tittel: string;
  beskrivelse: string;
  kategori: string;
  sted: string;
  bilder: string[];
  opprettet: string;
}

export default function VisGjenbruk() {
  const [annonser, setAnnonser] = useState<Gjenbruk[]>([]);
  const [sok, setSok] = useState("");
  const [type, setType] = useState("alle");
  const [kategori, setKategori] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("gjenbruk")
        .select("*")
        .order("opprettet", { ascending: false });
      setAnnonser(data || []);
    };
    hent();
  }, []);

  const filtrert = annonser.filter((a) => {
    const tekst = [a.tittel, a.beskrivelse, a.sted, a.kategori]
      .join(" ")
      .toLowerCase();

    return (
      tekst.includes(sok.toLowerCase()) &&
      (type === "alle" || a.type === type) &&
      (!kategori || a.kategori.toLowerCase().includes(kategori.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-bold">Gjenbruk</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Søk..."
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="alle">Alle typer</option>
          <option value="gies bort">Gies bort</option>
          <option value="byttes">Byttes</option>
          <option value="repareres">Til reparasjon</option>
        </select>
        <input
          type="text"
          placeholder="Kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {filtrert.length === 0 ? (
        <p>Ingen gjenbruksannonser funnet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtrert.map((a) => (
            <li key={a.id} className="border p-3 rounded bg-white shadow-sm space-y-2">
              {a.bilder?.[0] && (
                <img
                  src={a.bilder[0]}
                  alt={a.tittel}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="text-lg font-bold">{a.tittel}</h3>
              <p className="text-sm text-gray-600">{a.beskrivelse.slice(0, 100)}...</p>
              <p className="text-sm">Kategori: {a.kategori}</p>
              <p className="text-sm">Sted: {a.sted}</p>
              <p className="text-sm font-semibold capitalize">{a.type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
