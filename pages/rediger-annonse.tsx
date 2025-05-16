import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import Link from "next/link";

export default function RedigerAnnonse() {
  const router = useRouter();
  const { id } = router.query;
  const [annonse, setAnnonse] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id) return;
    const hent = async () => {
      const { data } = await supabase.from("annonser").select("*").eq("id", id).single();
      setAnnonse(data);
    };
    hent();
  }, [id]);

  const lagre = async (e: any) => {
    e.preventDefault();
    setStatus("Lagrer...");

    const { error } = await supabase.from("annonser").update({
      tittel: annonse.tittel,
      beskrivelse: annonse.beskrivelse,
      pris: annonse.pris,
      type: annonse.type,
    }).eq("id", id);

    if (error) {
      setStatus("Feil ved lagring");
    } else {
      setStatus("Lagret!");
    }
  };

  if (!annonse) return <p>Laster...</p>;

  return (
    <>
      <Head>
        <title>Rediger annonse | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rediger annonse</h1>
          <Link href="/" className="text-sm text-blue-600 underline">
            Tilbake til forsiden
          </Link>
        </div>

        <form onSubmit={lagre} className="space-y-4">
          <input
            type="text"
            value={annonse.tittel}
            onChange={(e) => setAnnonse({ ...annonse, tittel: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Tittel"
          />

          <textarea
            value={annonse.beskrivelse}
            onChange={(e) => setAnnonse({ ...annonse, beskrivelse: e.target.value })}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Beskrivelse"
          />

          <input
            type="number"
            value={annonse.pris}
            onChange={(e) => setAnnonse({ ...annonse, pris: Number(e.target.value) })}
            className="w-full border p-2 rounded"
            placeholder="Pris"
          />

          <select
            value={annonse.type}
            onChange={(e) => setAnnonse({ ...annonse, type: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option>Til salgs</option>
            <option>Gis bort</option>
            <option>Ønskes</option>
            <option>Ønskes kjøpt</option>
          </select>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Lagre endringer
          </button>

          {status && <p className="text-sm mt-2">{status}</p>}
        </form>
      </main>
    </>
  );
}
