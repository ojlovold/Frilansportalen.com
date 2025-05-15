import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

export default function GjenbrukListe() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [kategori, setKategori] = useState("");

  useEffect(() => {
    const hentAnnonser = async () => {
      const { data, error } = await supabase
        .from("gjenbruk")
        .select("*")
        .order("opprettet", { ascending: false });

      if (error) {
        console.error("Feil ved henting av annonser:", error.message);
      } else {
        setAnnonser(data || []);
      }
    };

    hentAnnonser();
  }, []);

  const filtrert = annonser.filter((a) => {
    return (
      a.tittel?.toLowerCase().includes(filter.toLowerCase()) &&
      (kategori === "" || a.kategori === kategori)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Søk etter ting"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="border border-black rounded p-2"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option value="">Alle kategorier</option>
          <option value="Møbler">Møbler</option>
          <option value="Klær">Klær</option>
          <option value="Verktøy">Verktøy</option>
          <option value="Diverse">Diverse</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrert.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-1">{a.tittel}</h2>
              <p className="text-sm text-gray-700 mb-2">
                {a.kategori} – {a.lokasjon}
              </p>
              <p className="text-sm text-gray-900">{a.beskrivelse}</p>
            </CardContent>
          </Card>
        ))}
        {filtrert.length === 0 && (
          <p className="text-gray-600">Ingen treff for søket ditt.</p>
        )}
      </div>
    </div>
  );
}
