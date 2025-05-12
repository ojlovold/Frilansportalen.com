import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../../lib/supabaseClient";

export default function LeggTilDugnad() {
  const user = useUser();
  const [status, setStatus] = useState("");

  const [data, setData] = useState({
    type: "ber om hjelp",
    tittel: "",
    beskrivelse: "",
    kategori: "",
    sted: "",
    frist: "",
  });

  const send = async () => {
    const brukerId = user && 'id' in user ? (user.id as string) : null;
    if (!brukerId) return;

    const { error } = await supabase.from("dugnader").insert([
      {
        ...data,
        opprettet_av: brukerId,
      },
    ]);

    setStatus(error ? "Feil ved publisering" : "Dugnad publisert!");
    if (!error) {
      setData({
        type: "ber om hjelp",
        tittel: "",
        beskrivelse: "",
        kategori: "",
        sted: "",
        frist: "",
      });
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Legg ut dugnadsoppdrag</h2>

      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="ber om hjelp">Jeg ber om hjelp (gratis)</option>
        <option value="tilbyr hjelp">Jeg tilbyr hjelp (gratis)</option>
        <option value="sommerjobb">Sommerjobb (100 kr)</option>
        <option value="småjobb">Småjobb (50 kr)</option>
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
        type="date"
        value={data.frist}
        onChange={(e) => setData({ ...data, frist: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Publiser
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
