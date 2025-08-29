"use client";

import { useState, useEffect } from "react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  brukerId: string;
};

const timeslots = Array.from({ length: 24 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const fra = `${String(hour).padStart(2, "0")}:${minute}:00`;
  const til = i % 2 === 0
    ? `${String(hour)}:30:00`
    : `${String(hour + 1).padStart(2, "0")}:00:00`;
  return { fra, til };
});

export default function TilgjengelighetEditor({ brukerId }: Props) {
  const [modus, setModus] = useState<"dag" | "uke" | "maaned">("dag");
  const [fraDato, setFraDato] = useState<string>("");
  const [valgteDatoer, setValgteDatoer] = useState<string[]>([]);
  const [valgteBlokker, setValgteBlokker] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (fraDato) kalkulerDatoer();
  }, [fraDato, modus]);

  const kalkulerDatoer = () => {
    const start = new Date(fraDato);
    let end = start;
    if (modus === "uke") end = endOfWeek(start, { weekStartsOn: 1 });
    else if (modus === "maaned") end = endOfMonth(start);

    const alle = eachDayOfInterval({ start, end });
    const isoDatoer = alle.map((d) => d.toISOString().split("T")[0]);
    setValgteDatoer(isoDatoer);
  };

  const toggleDato = (dato: string) => {
    setValgteDatoer((prev) =>
      prev.includes(dato)
        ? prev.filter((d) => d !== dato)
        : [...prev, dato]
    );
  };

  const toggleBlokk = (dato: string, fra_tid: string) => {
    setValgteBlokker((prev) => {
      const valgt = prev[dato] || [];
      return {
        ...prev,
        [dato]: valgt.includes(fra_tid)
          ? valgt.filter((tid) => tid !== fra_tid)
          : [...valgt, fra_tid],
      };
    });
  };

  const velgAlleBlokker = () => {
    const ny = { ...valgteBlokker };
    for (const dato of valgteDatoer) {
      ny[dato] = timeslots.map((t) => t.fra);
    }
    setValgteBlokker(ny);
  };

  const lagre = async (statusType: "ledig" | "opptatt") => {
    const blokker: any[] = [];
    for (const dato of valgteDatoer) {
      const blokkerForDato = valgteBlokker[dato] || [];
      for (const fra_tid of blokkerForDato) {
        const slot = timeslots.find((t) => t.fra === fra_tid);
        if (slot) {
          blokker.push({
            id: brukerId,
            dato,
            fra_tid,
            til_tid: slot.til,
            status: statusType,
          });
        }
      }
    }
    if (!blokker.length) return setStatus("Ingen tider valgt");
    const { error } = await supabase.from("tilgjengelighet").upsert(blokker);
    if (!error) {
      setStatus("✅ Lagret!");
      setValgteDatoer([]);
      setValgteBlokker({});
    } else {
      setStatus("❌ Feil ved lagring");
    }
  };

  return (
    <div className="bg-[#222] border border-gray-700 text-white p-4 rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4">Tilgjengelighetseditor</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={modus}
          onChange={(e) => setModus(e.target.value as any)}
          className="p-2 border rounded"
        >
          <option value="dag">Enkeltdag</option>
          <option value="uke">Uke</option>
          <option value="maaned">Måned</option>
        </select>

        <input
          type="date"
          value={fraDato}
          onChange={(e) => setFraDato(e.target.value)}
          className="p-2 border rounded"
        />

        <button onClick={velgAlleBlokker} className="bg-yellow-600 px-4 py-2 rounded text-white">
          Merk alle halvtimer
        </button>
      </div>

      {valgteDatoer.length > 0 && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {valgteDatoer.map((dato) => (
            <div key={dato}>
              <label className="flex items-center gap-2 font-medium mb-1">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => toggleDato(dato)}
                />
                {dato}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                {timeslots.map((slot) => {
                  const aktiv = valgteBlokker[dato]?.includes(slot.fra);
                  return (
                    <button
                      key={slot.fra}
                      onClick={() => toggleBlokk(dato, slot.fra)}
                      className={`text-xs px-2 py-1 rounded ${
                        aktiv ? "bg-green-600" : "bg-gray-700"
                      }`}
                    >
                      {slot.fra.slice(0, 5)}–{slot.til.slice(0, 5)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => lagre("ledig")}
          className="bg-green-600 px-4 py-2 rounded text-white"
        >
          Lagre som ledig
        </button>
        <button
          onClick={() => lagre("opptatt")}
          className="bg-red-600 px-4 py-2 rounded text-white"
        >
          Lagre som opptatt
        </button>
      </div>

      {status && <p className="mt-3 text-sm text-white/80">{status}</p>}
    </div>
  );
}
