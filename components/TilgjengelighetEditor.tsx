"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TilgjengelighetEditor({ brukerId }: { brukerId: string }) {
  const [valgtMåned, setValgtMåned] = useState<number | null>(null);
  const [valgtUke, setValgtUke] = useState<number | null>(null);
  const [valgteDager, setValgteDager] = useState<string[]>([]);
  const [tilgjengelighet, setTilgjengelighet] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState<"alle" | "ledig">("alle");

  const [fraTid, setFraTid] = useState("08:00");
  const [tilTid, setTilTid] = useState("09:00");

  const alleDagerIMåned = (måned: number): string[] => {
    const nå = new Date();
    const år = nå.getFullYear();
    const start = new Date(år, måned, 1);
    const dager: string[] = [];
    while (start.getMonth() === måned) {
      dager.push(start.toISOString().split("T")[0]);
      start.setDate(start.getDate() + 1);
    }
    return dager;
  };

  const alleDagerIUke = (ukeNr: number): string[] => {
    const nå = new Date();
    const år = nå.getFullYear();
    const ukeStart = new Date(år, 0, 1 + (ukeNr - 1) * 7);
    const dager: string[] = [];
    for (let i = 0; i < 7; i++) {
      const dag = new Date(ukeStart);
      dag.setDate(ukeStart.getDate() + i);
      dager.push(dag.toISOString().split("T")[0]);
    }
    return dager;
  };

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("tilgjengelighet").select("*").eq("id", brukerId);
      if (data) setTilgjengelighet(data);
    };
    if (brukerId) hent();
  }, [brukerId, status]);

  const toggleDag = (dato: string) => {
    setValgteDager((prev) =>
      prev.includes(dato) ? prev.filter((d) => d !== dato) : [...prev, dato]
    );
  };

  const lagre = async () => {
    if (!valgteDager.length || !fraTid || !tilTid) return setStatus("Velg dager og tid");

    const oppføringer = valgteDager.map((dato) => ({
      id: brukerId,
      dato,
      fra_tid: fraTid + ":00",
      til_tid: tilTid + ":00",
      status: "ledig"
    }));

    const { error } = await supabase.from("tilgjengelighet").upsert(oppføringer);
    if (!error) {
      setStatus("✅ Lagret");
      setValgteDager([]);
    } else {
      setStatus("❌ Feil ved lagring");
    }
  };

  const tidsvalg = Array.from({ length: 24 * 12 }, (_, i) => {
    const h = String(Math.floor(i / 12)).padStart(2, "0");
    const m = String((i % 12) * 5).padStart(2, "0");
    return `${h}:${m}`;
  });

  const filtrerte = filter === "ledig"
    ? tilgjengelighet.filter((t) => t.status === "ledig")
    : tilgjengelighet;

  const grupperte = filtrerte.reduce((acc: Record<string, any[]>, rad) => {
    (acc[rad.dato] ||= []).push(rad);
    return acc;
  }, {});

  return (
    <div className="bg-[#222] text-white border border-gray-700 p-4 rounded-xl mt-10">
      <h2 className="text-xl font-semibold mb-4">Tilgjengelighet</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={valgtMåned ?? ""}
          onChange={(e) => {
            const valgt = parseInt(e.target.value);
            if (!isNaN(valgt)) {
              setValgtMåned(valgt);
              setValgteDager(alleDagerIMåned(valgt));
            }
          }}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Velg måned</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{new Date(0, i).toLocaleString("no-NO", { month: "long" })}</option>
          ))}
        </select>

        <select
          value={valgtUke ?? ""}
          onChange={(e) => {
            const valgt = parseInt(e.target.value);
            if (!isNaN(valgt)) {
              setValgtUke(valgt);
              setValgteDager(alleDagerIUke(valgt));
            }
          }}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Velg uke</option>
          {Array.from({ length: 52 }, (_, i) => (
            <option key={i} value={i + 1}>Uke {i + 1}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <p className="text-sm mb-1">Velg tidsrom (fra og til):</p>
        <div className="flex gap-3">
          <select
            value={fraTid}
            onChange={(e) => setFraTid(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white font-mono"
          >
            {tidsvalg.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={tilTid}
            onChange={(e) => setTilTid(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white font-mono"
          >
            {tidsvalg.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-scroll">
        {valgteDager.map((dato) => (
          <div key={dato} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={true}
              onChange={() => toggleDag(dato)}
            />
            <span className="font-semibold">{dato}</span>
          </div>
        ))}
      </div>

      <button
        onClick={lagre}
        className="mt-6 bg-green-600 px-4 py-2 rounded"
      >
        Lagre tilgjengelighet
      </button>

      {status && <p className="mt-2 text-sm text-gray-300">{status}</p>}

      {/* VISNINGSSØK */}
      <div className="mt-10 border-t border-gray-600 pt-6">
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilter("alle")}
            className={`px-3 py-1 rounded ${filter === "alle" ? "bg-gray-700" : "bg-gray-800"}`}
          >
            Vis alle
          </button>
          <button
            onClick={() => setFilter("ledig")}
            className={`px-3 py-1 rounded ${filter === "ledig" ? "bg-green-700" : "bg-gray-800"}`}
          >
            Kun ledige
          </button>
        </div>

        {Object.keys(grupperte).length === 0 && (
          <p className="text-gray-400">Ingen tider registrert.</p>
        )}

        <div className="space-y-4 max-h-[500px] overflow-y-scroll pr-2">
          {Object.entries(grupperte)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dato, tider]: [string, any[]]) => (
              <div key={dato}>
                <h3 className="text-lg font-semibold mb-1">{dato}</h3>
                <div className="flex flex-wrap gap-2">
                  {tider
                    .sort((a, b) => a.fra_tid.localeCompare(b.fra_tid))
                    .map((t) => (
                      <span
                        key={t.fra_tid + t.til_tid}
                        className={`text-xs px-2 py-1 rounded border ${
                          t.status === "ledig"
                            ? "bg-green-700 border-green-600"
                            : "bg-red-700 border-red-600"
                        }`}
                      >
                        {t.fra_tid.slice(0, 5)}–{t.til_tid.slice(0, 5)}
                      </span>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
