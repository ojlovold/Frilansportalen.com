import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import dynamic from "next/dynamic";

const MapStillinger = dynamic(() => import("../../components/MapStillinger"), { ssr: false });

export default function StillingerPage() {
  const [stillinger, setStillinger] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const hentStillinger = async () => {
      const { data } = await supabase.from("stilling").select("*").order("opprettet", { ascending: false });
      setStillinger(data || []);
    };
    hentStillinger();
  }, []);

  const filtrert = stillinger.filter((s) =>
    s.tittel?.toLowerCase().includes(filter.toLowerCase()) ||
    s.fagfelt?.toLowerCase().includes(filter.toLowerCase()) ||
    s.lokasjon?.tekst?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Stillinger | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-yellow-300 text-black p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Ledige stillinger</h1>

          <div className="mb-6">
            <Input
              placeholder="Søk etter stilling, fag eller sted"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="mb-10">
            <MapStillinger stillinger={filtrert} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrert.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-1">{s.tittel}</h2>
                  <p className="text-sm mb-1">{s.kategori} – {s.fagfelt}</p>
                  <p className="text-sm text-gray-800">{s.lokasjon?.tekst}</p>
                </CardContent>
              </Card>
            ))}
            {filtrert.length === 0 && <p>Ingen stillinger matcher søket ditt.</p>}
          </div>
        </div>
      </main>
    </>
  );
}
