import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";

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

  const [betaling, setBetaling] = useState<"stripe" | "vipps">("stripe");

  const getPris = () => {
    if (data.type === "sommerjobb") return 100;
    if (data.type === "småjobb") return 50;
    return 0;
  };

  const sendGratis = async () => {
    if (!user) return;
    const { error } = await supabase.from("dugnader").insert([
      {
        type: data.type,
        tittel: data.tittel,
        beskrivelse: data.beskrivelse,
        kategori: data.kategori,
        sted: data.sted,
        frist: data.frist,
        opprettet_av: user.id,
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

  const betalOgSend = async () => {
    setStatus("Starter betaling...");

    const api = betaling === "vipps" ? "/api/vipps" : "/api/stripe";
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        belop: getPris(),
        metadata: {
          bruker_id: user?.id,
          type: data.type,
          tittel: data.tittel,
          beskrivelse: data.beskrivelse,
          kategori: data.kategori,
          sted: data.sted,
          frist: data.frist,
        },
      }),
    });

    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      setStatus("Noe gikk galt med betalingen.");
    }
  };

  const send = () => {
    if (!user) {
      setStatus("Du må være innlogget.");
      return;
    }
    if (!data.tittel || !data.beskrivelse) {
      setStatus("Tittel og beskrivelse må fylles ut.");
      return;
    }

    if (getPris() > 0) betalOgSend();
    else sendGratis();
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

      {getPris() > 0 && (
        <div className="space-y-2">
          <p className="text-sm">Velg betalingsmåte ({getPris()} kr):</p>
          <label className="flex gap-2">
            <input
              type="radio"
              checked={betaling === "stripe"}
              onChange={() => setBetaling("stripe")}
            />
            Kortbetaling (Stripe)
          </label>
          <label className="flex gap-2">
            <input
              type="radio"
              checked={betaling === "vipps"}
              onChange={() => setBetaling("vipps")}
            />
            Vipps
          </label>
        </div>
      )}

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
        {getPris() > 0 ? "Betal og publiser" : "Publiser"}
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
