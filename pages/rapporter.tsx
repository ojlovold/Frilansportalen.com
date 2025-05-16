import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import Link from "next/link";

export default function Rapporter() {
  const [rapporter, setRapporter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("rapporter")
        .select("*")
        .order("tidspunkt", { ascending: false });

      setRapporter(data || []);
    };
    hent();
  }, []);

  return (
    <>
      <Head>
        <title>Rapporterte saker | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rapporterte saker</h1>
          <Link href="/" className="text-sm underline text-blue-600">Tilbake til forsiden</Link>
        </div>

        {rapporter.length === 0 ? (
          <p>Ingen rapporter funnet.</p>
        ) : (
          <ul className="space-y-4">
            {rapporter.map((r) => (
              <li key={r.id} className="bg-gray-100 rounded-xl p-4 shadow">
                <p><strong>Type:</strong> {r.type}</p>
                <p><strong>Melding:</strong> {r.beskrivelse}</p>
                <p><strong>Dato:</strong> {new Date(r.tidspunkt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
