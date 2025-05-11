import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import SvarBoks from "./SvarBoks";
import Link from "next/link";
import clsx from "clsx"; // valgfritt for klassekontroll

interface Epost {
  id: string;
  fra: string;
  til: string;
  emne: string;
  innhold: string;
  opprettet: string;
  ulest?: boolean;
  arkivert?: boolean;
  slettet?: boolean;
  vedlegg?: Vedlegg[];
  svar?: Epost[];
}

interface Vedlegg {
  filnavn: string;
  url: string;
}

export default function EpostInnboks({ brukerId }: { brukerId: string }) {
  const [alleMeldinger, setAlleMeldinger] = useState<Epost[]>([]);
  const [sok, setSok] = useState("");
  const [åpenMelding, setÅpenMelding] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      const { data: eposter } = await supabase
        .from("epost")
        .select("*")
        .or(`til.eq.${brukerId},fra.eq.${brukerId}`)
        .not("slettet", "is", true)
        .order("opprettet", { ascending: false });

      if (!eposter) return;

      const hovedmeldinger = eposter.filter((m) => !m.svar_paa);

      const medSvarOgVedlegg = await Promise.all(
        hovedmeldinger.map(async (m) => {
          const { data: svar } = await supabase
            .from("epost")
            .select("*")
            .eq("svar_paa", m.id)
            .not("slettet", "is", true)
            .order("opprettet");

          const { data: vedlegg } = await supabase
            .from("epostvedlegg_meta")
            .select("filnavn, url")
            .eq("epost_id", m.id);

          return { ...m, vedlegg: vedlegg || [], svar: svar || [] };
        })
      );

      setAlleMeldinger(medSvarOgVedlegg);
    };

    hent();
  }, [brukerId]);

  const filtrert = alleMeldinger.filter((m) => {
    const q = sok.toLowerCase();
    return (
      m.emne?.toLowerCase().includes(q) ||
      m.innhold?.toLowerCase().includes(q) ||
      m.fra?.toLowerCase().includes(q) ||
      m.til?.toLowerCase().includes(q)
    );
  });

  const markerSomLest = async (id: string) => {
    await supabase.from("epost").update({ ulest: false }).eq("id", id);
    setAlleMeldinger((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ulest: false } : m))
    );
    setÅpenMelding(id);
  };

  const arkiver = async (id: string) => {
    await supabase.from("epost").update({ arkivert: true }).eq("id", id);
    setAlleMeldinger((prev) => prev.filter((m) => m.id !== id));
  };

  const slett = async (id: string) => {
    await supabase.from("epost").update({ slettet: true }).eq("id", id);
    setAlleMeldinger((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Innboks</h2>

      <input
        type="text"
        placeholder="Søk i e-post..."
        className="w-full border p-2 rounded"
        value={sok}
        onChange={(e) => setSok(e.target.value)}
      />

      {filtrert.length === 0 ? (
        <p>Ingen e-post matcher søket.</p>
      ) : (
        <ul className="space-y-6">
          {filtrert.map((m, i) => (
            <li
              key={i}
              className={clsx(
                "border p-4 rounded bg-white text-black shadow-sm",
                m.ulest && m.til === brukerId && "border-blue-500"
              )}
              onClick={() => m.til === brukerId && m.ulest && markerSomLest(m.id)}
            >
              <div className="flex justify-between">
                <div>
                  <p className={m.ulest ? "font-bold" : ""}><strong>Fra:</strong> {m.fra}</p>
                  <p><strong>Til:</strong> {m.til}</p>
                </div>
                <div className="text-right text-sm text-gray-500 space-x-2">
                  <button onClick={() => arkiver(m.id)} className="underline">
                    Arkiver
                  </button>
                  <button onClick={() => slett(m.id)} className="underline text-red-600">
                    Slett
                  </button>
                </div>
              </div>

              <p><strong>Emne:</strong> {m.emne}</p>
              <p className="mt-2 whitespace-pre-line">{m.innhold}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(m.opprettet).toLocaleString()}
              </p>

              {m.vedlegg.length > 0 && (
                <div className="mt-3">
                  <strong>Vedlegg:</strong>
                  <ul className="list-disc list-inside">
                    {m.vedlegg.map((v, j) => (
                      <li key={j}>
                        <a href={v.url} target="_blank" className="text-blue-600 underline">
                          {v.filnavn}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {m.svar.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-300 space-y-3">
                  <strong>Tråd:</strong>
                  {m.svar.map((svar, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <p><strong>Fra:</strong> {svar.fra}</p>
                      <p className="whitespace-pre-line">{svar.innhold}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(svar.opprettet).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {m.til === brukerId && (
                <SvarBoks
                  svarFra={brukerId}
                  svarTil={m.fra}
                  originalEpostId={m.id}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
