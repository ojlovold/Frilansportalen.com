import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function LeggUtAnnonse() {
  const user = useUser();
  const [firma, setFirma] = useState(false);
  const [status, setStatus] = useState("");

  const [data, setData] = useState({
    type: "selges",
    tittel: "",
    beskrivelse: "",
    kategori: "",
    pris: "",
    sted: "",
    bilder: [] as File[],
  });

  useEffect(() => {
    const hentFirmaStatus = async () => {
      const brukerId = user && "id" in user ? (user.id as string) : null;
      if (!brukerId) return;

      const { data } = await supabase
        .from("brukerprofiler")
        .select("er_firma")
        .eq("id", brukerId)
        .single();

      if (data?.er_firma) setFirma(true);
    };
    hentFirmaStatus();
  }, [user]);

  const lastOppBilder = async (brukerId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const fil of data.bilder) {
      const path = `marked/${brukerId}/${Date.now()}_${fil.name}`;
      const { error } = await supabase.storage.from("dokumenter").upload(path, fil);
      if (!error) {
        const url = supabase.storage.from("dokumenter").getPublicUrl(path).data.publicUrl;
        urls.push(url);
      }
    }
    return urls;
  };

  const send = async () => {
    const brukerId = user && "id" in user ? (user.id as string) : null;
    if (!brukerId) return;

    const bilder = await lastOppBilder(brukerId);

    const { error } = await supabase.from("annonser").insert([
      {
        opprettet_av: brukerId,
        type: data.type,
        tittel: data.tittel,
        beskrivelse: data.beskrivelse,
        kategori: data.kategori,
        pris: data.type === "gis bort" ? 0 : Number(data.pris),
        sted: data.sted,
        bilder,
        firma,
      },
    ]);

    setStatus(error ? "Feil ved innsending" : "Annonsen ble publisert!");
    if (!error) {
      setData({
        type: "selges",
        tittel: "",
        beskrivelse: "",
        kategori: "",
        pris: "",
        sted: "",
        bilder: [],
      });
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Legg ut annonse</h2>

      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="selges">Til salgs</option>
        <option value="gis bort">Gis bort</option>
        <option value="ønskes kjøpt">Ønskes kjøpt</option>
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

      {data.type !== "gis bort" && (
        <input
          type="number"
          placeholder="Pris i kr"
          value={data.pris}
          onChange={(e) => setData({ ...data, pris: e.target.value })}
          className="w-full border p-2 rounded"
        />
      )}

      <input
        type="file"
        multiple
        onChange={(e) =>
          setData({ ...data, bilder: Array.from(e.target.files || []) })
        }
      />

      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Publiser annonse
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
