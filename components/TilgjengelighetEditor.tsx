"use client";

import { useEffect, useState } from "react";
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
  const [tilgjengelighet, setTilgjengelighet] = useState<any[]>([]);
  const [valgteDatoer, setValgteDatoer] = useState<string[]>([]);
  const [valgteBlokker, setValgteBlokker] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("tilgjengelighet")
        .select("*")
        .eq("id", brukerId);

      if (data) setTilgjengelighet(data);
    };
    if (brukerId) hent();
  }, [brukerId]);

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

  const lagre = async (statusType: "ledig" | "opptatt") => {
    if (!valgteDatoer.length) return;
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

    if (blokker.length === 0) return setStatus("Ingen tider valgt");

    const { error } = await supabase.from("tilgjengelighet").upsert(blokker);
    if (!error) {
      setStatus(`✅ Lagret som ${statusType}`);
      setValgteDatoer([]);
      setValgteBlokker({});
    } else {
      setStatus("❌ Feil ved lagring");
    }
  };

  return (
    <div className="bg-[#222] text-white border border-gray-700 p-4 rounded-xl mt-10">
      <h2 className="text-xl font-semibold mb-4">Tilgjengelighet (365 dager + halvtimer)</h2>
      <p className="text-sm text-gray-400 mb-2">Velg datoer og marker halvtimer som ledig eller opptatt</p>

      <div className="max-h-[300px] overflow-y-scroll border rounded p-3 space-y-2">
        {[...Array(365)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const iso = d.toISOString().split("T")[0];
          const valgt = valgteDatoer.includes(iso);

          return (
            <div key={iso}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={valgt}
                  onChange={() => toggleDato(iso)}
                />
                <span className="font-medium">{iso}</span>
              </label>

              {valgt && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 mt-1">
                  {timeslots.map((slot) => {
                    const aktiv = valgteBlokker[iso]?.includes(slot.fra);
                    return (
                      <button
                        key={slot.fra}
                        onClick={() => toggleBlokk(iso, slot.fra)}
                        className={`text-xs px-2 py-1 rounded ${
                          aktiv ? "bg-green-600" : "bg-gray-700"
                        }`}
                      >
                        {slot.fra.slice(0, 5)}–{slot.til.slice(0, 5)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => lagre("ledig")}
          className="bg-green-600 px-4 py-2 rounded text-white"
        >
          Merk som ledig
        </button>
        <button
          onClick={() => lagre("opptatt")}
          className="bg-red-600 px-4 py-2 rounded text-white"
        >
          Merk som opptatt
        </button>
      </div>

      {status && <p className="text-sm text-gray-300 mt-2">{status}</p>}
    </div>
  );
}
