import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-nextjs";
import supabase from "@/lib/supabaseClient";

export default function LeggTilGjenbruk() {
  const user = useUser();
  const [status, setStatus] = useState("");

  const [data, setData] = useState({
    type: "gies bort",
    tittel: "",
    beskrivelse: "",
    kategori: "",
    sted: "",
    bilder: [] as File[],
  });

  const lastOppBilder = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const fil of data.bilder) {
      const path = `gjenbruk/${user?.id}/${Date.now()}_${fil.name}`;
      const { error } = await supabase.storage.from("dokumenter").upload(path, fil);
      if (!error) {
        const url = supabase.storage.from("dokumenter").getPublicUrl(path).data.publicUrl;
        urls.push(url);
      }
    }
    return urls;
  };

  const send = async () => {
    if (!user) return;
    const bilder = await lastOppBilder();

    const { error } = await supabase.from("gjenbruk").insert([
      {
        opprettet_av: user.id,
        type: data.type,
        tittel: data.tittel,
        beskrivelse: data.beskrivelse,
        kategori: data.kategori,
        sted: data.sted,
        bilder,
      },
    ]);

    setStatus(error ? "Feil ved innsending" : "Publisert!");
    if (!error) {
      setData({
        type: "gies bort",
        tittel: "",
        beskrivelse: "",
        kategori: "",
        sted: "",
        bilder: [],
      });
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Legg ut gjenbruk</h2>

      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="gies bort">Gies bort</option>
        <option value="byttes">Byttes</option>
        <option value="repareres">Til reparasjon</option>
      </select>

      <input
        placeholder="Tittel"
        value={data.tittel}
        onChange={(e) => setData({ ...data, tittel: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Beskrivelse"
        value={data.beskrivelse}
        onChange={(e) => setData({ ...data, beskrivelse: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Kategori"
        value={data.kategori}
        onChange={(e) => setData({ ...data, kategori: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Sted"
        value={data.sted}
        onChange={(e) => setData({ ...data, sted: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        type="file"
        multiple
        onChange={(e) =>
          setData({ ...data, bilder: Array.from(e.target.files || []) })
        }
      />

      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Publiser
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
