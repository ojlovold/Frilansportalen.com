import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Fagfil {
  id: string;
  tittel: string;
  beskrivelse: string;
  kategori: string;
  url: string;
  filnavn: string;
}

export default function FagbibliotekAdmin() {
  const [filer, setFiler] = useState<Fagfil[]>([]);
  const [redigering, setRedigering] = useState<string | null>(null);
  const [endret, setEndret] = useState<{ [key: string]: Partial<Fagfil> }>({});

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

  const lagre = async (id: string) => {
    const oppdater = endret[id];
    if (!oppdater) return;

    await supabase.from("fagbibliotek").update(oppdater).eq("id", id);
    setRedigering(null);
    location.reload();
  };

  const slett = async (id: string) => {
    await supabase.from("fagbibliotek").delete().eq("id", id);
    setFiler((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Administrer fagbibliotek</h2>

      {filer.length === 0 ? (
        <p>Ingen fagfiler funnet.</p>
      ) : (
        <ul className="space-y-4">
          {filer.map((f) => (
            <li key={f.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-2">
              {redigering === f.id ? (
                <>
                  <input
                    value={endret[f.id]?.tittel || f.tittel}
                    onChange={(e) =>
                      setEndret((prev) => ({
                        ...prev,
                        [f.id]: { ...prev[f.id], tittel: e.target.value },
                      }))
                    }
                    className="w-full border p-2 rounded"
                  />
                  <textarea
                    value={endret[f.id]?.beskrivelse || f.beskrivelse}
                    onChange={(e) =>
                      setEndret((prev) => ({
                        ...prev,
                        [f.id]: { ...prev[f.id], beskrivelse: e.target.value },
                      }))
                    }
                    className="w-full border p-2 rounded"
                  />
                  <select
                    value={endret[f.id]?.kategori || f.kategori}
                    onChange={(e) =>
                      setEndret((prev) => ({
                        ...prev,
                        [f.id]: { ...prev[f.id], kategori: e.target.value },
                      }))
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option>Generelt</option>
                    <option>HMS</option>
                    <option>Arbeidsrett</option>
                    <option>Skjema</option>
                    <option>Bransjestandard</option>
                  </select>

                  <div className="flex gap-4 mt-2">
                    <button onClick={() => lagre(f.id)} className="bg-black text-white px-4 py-2 rounded">
                      Lagre
                    </button>
                    <button onClick={() => setRedigering(null)} className="text-gray-500 underline">
                      Avbryt
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>{f.tittel}</strong> ({f.kategori})</p>
                  <p className="text-sm text-gray-700">{f.beskrivelse}</p>
                  <a href={f.url} target="_blank" className="text-blue-600 underline text-sm">
                    {f.filnavn}
                  </a>
                  <div className="flex gap-4 mt-2">
                    <button onClick={() => setRedigering(f.id)} className="text-blue-600 underline">
                      Rediger
                    </button>
                    <button onClick={() => slett(f.id)} className="text-red-600 underline">
                      Slett
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
