"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";

export default function TilgjengelighetEditor({ brukerId }: { brukerId: string }) {
  const [valgtMåned, setValgtMåned] = useState<number | null>(null);
  const [valgtUke, setValgtUke] = useState<number | null>(null);
  const [valgteDager, setValgteDager] = useState<string[]>([]);
  const [tilgjengelighet, setTilgjengelighet] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState<"alle" | "ledig">("alle");

  const [fraTime, setFraTime] = useState("08");
  const [fraMinutt, setFraMinutt] = useState("00");
  const [tilTime, setTilTime] = useState("09");
  const [tilMinutt, setTilMinutt] = useState("00");

  const [adresse, setAdresse] = useState("");
  const [telefon, setTelefon] = useState("");

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
    const valgtMnd = valgtMåned ?? ukeStart.getMonth();
    const dager: string[] = [];
    for (let i = 0; i < 7; i++) {
      const dag = new Date(ukeStart);
      dag.setDate(ukeStart.getDate() + i);
      if (dag.getFullYear() === år && dag.getMonth() === valgtMnd) {
        dager.push(dag.toISOString().split("T")[0]);
      }
    }
    return dager;
  };

  const hent = async () => {
    const { data } = await supabase.from("tilgjengelighet").select("*").eq("id", brukerId);
    if (data) setTilgjengelighet(data);
  };

  useEffect(() => {
    if (brukerId) hent();
  }, [brukerId, status]);

  const toggleDag = (dato: string) => {
    setValgteDager((prev) =>
      prev.includes(dato) ? prev.filter((d) => d !== dato) : [...prev, dato]
    );
  };

  const lagre = async () => {
    if (!valgteDager.length) return setStatus("Velg dager");
    const fraTid = `${fraTime}:${fraMinutt}:00`;
    const tilTid = `${tilTime}:${tilMinutt}:00`;

    const oppføringer = valgteDager.map((dato) => ({
      id: brukerId,
      dato,
      fra_tid: fraTid,
      til_tid: tilTid,
      status: "ledig",
      adresse,
      telefon
    }));

    const { error } = await supabase.from("tilgjengelighet").upsert(oppføringer);
    if (!error) {
      setStatus("✅ Lagret");
      setValgteDager([]);
    } else {
      setStatus("❌ Feil ved lagring");
    }
  };

  const slettOppføring = async (dato: string, fra_tid: string, til_tid: string) => {
    await supabase.from("tilgjengelighet").delete().match({ id: brukerId, dato, fra_tid, til_tid });
    setStatus("⛔ Fjernet tidspunkt");
    hent();
  };

  const oppdaterStatus = async (dato: string, fra_tid: string, til_tid: string, nyStatus: string) => {
    await supabase.from("tilgjengelighet").update({ status: nyStatus }).match({ id: brukerId, dato, fra_tid, til_tid });
    hent();
  };
    const eksporterPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFont("helvetica", "bold");
    doc.text("Tilgjengelighet – Frilansportalen", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");

    if (adresse) {
      doc.text(`Adresse: ${adresse}`, 20, y);
      y += 7;
    }
    if (telefon) {
      doc.text(`Telefon: ${telefon}`, 20, y);
      y += 10;
    }

    const grupperte = tilgjengelighet.reduce((acc: Record<string, any[]>, rad) => {
      (acc[rad.dato] ||= []).push(rad);
      return acc;
    }, {});

    for (const [dato, tider] of Object.entries(grupperte)) {
      doc.setFont("helvetica", "bold");
      doc.text(dato, 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");

      for (const t of tider) {
        doc.text(` - ${t.fra_tid.slice(0, 5)}–${t.til_tid.slice(0, 5)} (${t.status})`, 25, y);
        y += 6;
      }
      y += 4;
    }

    doc.save("tilgjengelighet.pdf");
  };

  const timer = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutter = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

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

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("no-NO", { month: "long" })}
            </option>
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

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          placeholder="Adresse"
          className="p-2 rounded bg-gray-800 text-white w-full"
        />
        <input
          type="text"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          placeholder="Telefon"
          className="p-2 rounded bg-gray-800 text-white w-full"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm mb-1">Velg tidsrom (fra og til):</p>
        <div className="flex gap-3 flex-wrap">
          <div>
            <label className="block text-xs mb-1">Fra</label>
            <div className="flex gap-1">
              <select value={fraTime} onChange={(e) => setFraTime(e.target.value)} className="p-2 rounded bg-gray-800 text-white font-mono">
                {timer.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={fraMinutt} onChange={(e) => setFraMinutt(e.target.value)} className="p-2 rounded bg-gray-800 text-white font-mono">
                {minutter.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">Til</label>
            <div className="flex gap-1">
              <select value={tilTime} onChange={(e) => setTilTime(e.target.value)} className="p-2 rounded bg-gray-800 text-white font-mono">
                {timer.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={tilMinutt} onChange={(e) => setTilMinutt(e.target.value)} className="p-2 rounded bg-gray-800 text-white font-mono">
                {minutter.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-scroll">
        {valgteDager.map((dato) => {
          const ukedag = new Date(dato).toLocaleDateString("no-NO", { weekday: "long" });
          return (
            <div key={dato} className="flex items-center gap-2">
              <input type="checkbox" checked={true} onChange={() => toggleDag(dato)} />
              <span className="font-semibold">{ukedag} {dato}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-6 flex-wrap">
        <button onClick={lagre} className="bg-green-600 px-4 py-2 rounded">Lagre tilgjengelighet</button>
        <button onClick={eksporterPDF} className="bg-blue-600 px-4 py-2 rounded">Eksporter som PDF</button>
      </div>

      {status && <p className="mt-2 text-sm text-gray-300">{status}</p>}

      <div className="mt-10 border-t border-gray-600 pt-6">
        <div className="flex gap-3 mb-4">
          <button onClick={() => setFilter("alle")} className={`px-3 py-1 rounded ${filter === "alle" ? "bg-gray-700" : "bg-gray-800"}`}>
            Vis alle
          </button>
          <button onClick={() => setFilter("ledig")} className={`px-3 py-1 rounded ${filter === "ledig" ? "bg-green-700" : "bg-gray-800"}`}>
            Kun ledige
          </button>
        </div>

        {Object.keys(grupperte).length === 0 && (
          <p className="text-gray-400">Ingen tider registrert.</p>
        )}

        <div className="space-y-4 max-h-[500px] overflow-y-scroll pr-2">
          {Object.entries(grupperte)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dato, tider]) => (
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
                        } flex items-center gap-2`}
                      >
                        {t.fra_tid.slice(0, 5)}–{t.til_tid.slice(0, 5)}
                        <button onClick={() => slettOppføring(t.dato, t.fra_tid, t.til_tid)} className="text-white/70 hover:text-red-300">✕</button>
                        {t.status === "ledig" && (
                          <button onClick={() => oppdaterStatus(t.dato, t.fra_tid, t.til_tid, "opptatt")} className="text-white/70 hover:text-yellow-300">✓</button>
                        )}
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
