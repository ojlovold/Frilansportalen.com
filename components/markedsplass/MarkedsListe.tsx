import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function MarkedsListe() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [kategori, setKategori] = useState("");
  const [type, setType] = useState("");
  const [sortering, setSortering] = useState("nyeste");
  const [lokasjon, setLokasjon] = useState("");
  const [minPris, setMinPris] = useState("");
  const [maxPris, setMaxPris] = useState("");
  const [kunMedBilde, setKunMedBilde] = useState(false);

  useEffect(() => {
    const hentAnnonser = async () => {
      const { data, error } = await supabase.from("markedsplass").select("*").order("opprettet", { ascending: false });
      if (error) {
        console.error("Feil ved henting av annonser:", error.message);
      } else {
        setAnnonser(data || []);
      }
    };
    hentAnnonser();
  }, []);

  const filtrert = annonser
    .filter((a) => {
      const tittelMatch = a.tittel?.toLowerCase().includes(filter.toLowerCase());
      const kategoriMatch = kategori === "" || a.kategori === kategori;
      const typeMatch = type === "" || a.type === type;
      const stedMatch = lokasjon === "" || a.lokasjon?.toLowerCase().includes(lokasjon.toLowerCase());
      const minPrisMatch = !minPris || (a.pris || 0) >= parseInt(minPris);
      const maxPrisMatch = !maxPris || (a.pris || 0) <= parseInt(maxPris);
      const bildeMatch = !kunMedBilde || !!a.bilde;
      return tittelMatch && kategoriMatch && typeMatch && stedMatch && minPrisMatch && maxPrisMatch && bildeMatch;
    })
    .sort((a, b) => {
      if (sortering === "nyeste") return b.opprettet.localeCompare(a.opprettet);
      if (sortering === "eldste") return a.opprettet.localeCompare(b.opprettet);
      if (sortering === "pris-opp") return (a.pris || 0) - (b.pris || 0);
      if (sortering === "pris-ned") return (b.pris || 0) - (a.pris || 0);
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input placeholder="Søk etter annonse" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <Input placeholder="Sted / postnummer" value={lokasjon} onChange={(e) => setLokasjon(e.target.value)} />
        <select className="bg-gray-200 border border-black rounded shadow-inner p-2" value={kategori} onChange={(e) => setKategori(e.target.value)}>
          <option value="">Alle kategorier</option>
          <option value="Elektronikk">Elektronikk</option>
          <option value="Møbler">Møbler</option>
          <option value="Tjenester">Tjenester</option>
          <option value="Diverse">Diverse</option>
        </select>
        <select className="bg-gray-200 border border-black rounded shadow-inner p-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Alle typer</option>
          <option value="produkt">Produkt</option>
          <option value="tjeneste">Tjeneste</option>
          <option value="ønskes kjøpt">Ønskes kjøpt</option>
        </select>
        <Input type="number" placeholder="Min pris" value={minPris} onChange={(e) => setMinPris(e.target.value)} />
        <Input type="number" placeholder="Maks pris" value={maxPris} onChange={(e) => setMaxPris(e.target.value)} />
        <select className="bg-gray-200 border border-black rounded shadow-inner p-2" value={sortering} onChange={(e) => setSortering(e.target.value)}>
          <option value="nyeste">Nyeste først</option>
          <option value="eldste">Eldste først</option>
          <option value="pris-opp">Pris: lav til høy</option>
          <option value="pris-ned">Pris: høy til lav</option>
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={kunMedBilde} onChange={(e) => setKunMedBilde(e.target.checked)} />
          Vis bare annonser med bilde
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrert.map((a) => (
          <Card key={a.id} className="bg-gray-100 shadow-xl">
            <CardContent className="p-4">
              {a.bilde && (
                <div className="mb-4 rounded overflow-hidden shadow">
                  <Image
                    src={a.bilde}
                    alt={a.tittel}
                    width={400}
                    height={250}
                    className="object-cover w-full h-48 rounded"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-1">{a.tittel}</h2>
              <p className="text-sm text-gray-700 mb-2">
                {a.kategori} – {a.type} – {a.lokasjon}
              </p>
              <p className="text-sm text-gray-900 mb-2">{a.beskrivelse}</p>
              {a.pris && <p className="font-bold text-black">Pris: {a.pris} kr</p>}
            </CardContent>
          </Card>
        ))}
        {filtrert.length === 0 && (
          <p className="text-gray-600">Ingen annonser funnet.</p>
        )}
      </div>
    </div>
  );
}
