import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function LagCV({ brukerId }: { brukerId: string }) {
  const [ferdigheter, setFerdigheter] = useState<string[]>([]);
  const [nyeFerdigheter, setNyeFerdigheter] = useState<string[]>([]);
  const [valg, setValg] = useState({ språk: "", utdanning: "" });
  const [egne, setEgne] = useState({ språk: "", utdanning: "", erfaring: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data: forslag } = await supabase
        .from("cv_forslag")
        .select("*")
        .eq("id", "global")
        .single();
      if (forslag) setFerdigheter(forslag.ferdigheter || []);

      const { data: prosjekter } = await supabase
        .from("prosjektdeltakere")
        .select("prosjekt:prosjekter(navn, status, frist)")
        .eq("bruker_id", brukerId);

      const fullførte = prosjekter
        ?.filter((p) => p.prosjekt?.status === "fullført")
        .map((p) => `Prosjekt: ${p.prosjekt.navn} – Frist: ${p.prosjekt.frist}`);

      setEgne((prev) => ({
        ...prev,
        erfaring: [prev.erfaring, ...(fullførte || [])].filter(Boolean).join("\n"),
      }));
    };
    hent();
  }, [brukerId]);

  const les = (tekst: string) => {
    if (typeof window !== "undefined" && window.lesTekst) {
      window.lesTekst(tekst);
    }
  };

  const leggTilFerdighet = (tekst: string) => {
    if (!tekst.trim()) return;
    setNyeFerdigheter((prev) => [...prev, tekst.trim()]);
  };

  const lagreSomForslag = async () => {
    const forslag = Array.from(new Set([...ferdigheter, ...nyeFerdigheter]));
    await supabase.from("cv_forslag").upsert([{ id: "global", ferdigheter: forslag }]);
    setStatus("CV-data lagret og forslag oppdatert.");
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-bold">Bygg din CV</h2>

      <div>
        <label className="font-semibold" onMouseEnter={() => les("Ferdigheter")}>
          Ferdigheter
        </label>
        <div className="flex gap-2 flex-wrap mt-2">
          {ferdigheter.map((f) => (
            <span key={f} className="px-2 py-1 bg-yellow-200 text-sm rounded">{f}</span>
          ))}
          {nyeFerdigheter.map((f) => (
            <span key={f} className="px-2 py-1 bg-green-100 text-sm rounded">{f}</span>
          ))}
        </div>
        <input
          placeholder="Legg til ny ferdighet"
          onBlur={(e) => leggTilFerdighet(e.target.value)}
          onFocus={() => les("Legg til ny ferdighet")}
          className="mt-2 border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label onMouseEnter={() => les("Språk")} className="font-semibold">Språk</label>
          <input
            placeholder="Eks: Norsk, Engelsk"
            value={valg.språk || egne.språk}
            onChange={(e) => setEgne((prev) => ({ ...prev, språk: e.target.value }))}
            onFocus={() => les("Skriv inn språk")}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label onMouseEnter={() => les("Utdanning")} className="font-semibold">Utdanning</label>
          <input
            placeholder="Eks: Bachelor i Økonomi"
            value={valg.utdanning || egne.utdanning}
            onChange={(e) => setEgne((prev) => ({ ...prev, utdanning: e.target.value }))}
            onFocus={() => les("Skriv inn utdanning")}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="md:col-span-2">
          <label onMouseEnter={() => les("Arbeidserfaring")} className="font-semibold">
            Arbeidserfaring
          </label>
          <textarea
            placeholder="Fritekst eller generert fra prosjekter"
            value={egne.erfaring}
            onChange={(e) => setEgne((prev) => ({ ...prev, erfaring: e.target.value }))}
            onFocus={() => les("Skriv inn arbeidserfaring")}
            className="w-full border p-2 rounded min-h-[120px]"
          />
        </div>
      </div>

      <button
        onClick={lagreSomForslag}
        onMouseEnter={() => les("Lagre og oppdater forslag")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Lagre og oppdater forslag
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
