import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import SvarBoks from "./SvarBoks";

interface Epost {
  id: string;
  fra: string;
  til: string;
  emne: string;
  innhold: string;
  opprettet: string;
  vedlegg?: Vedlegg[];
  svar?: Epost[];
  // ulest?: boolean;
  // arkivert?: boolean;
}

interface Vedlegg {
  filnavn: string;
  url: string;
}

export default function EpostInnboks({ brukerId }: { brukerId: string }) {
  const [alleMeldinger, setAlleMeldinger] = useState<Epost[]>([]);
  const [filtrert, setFiltrert] = useState<Epost[]>([]);
  const [sok, setSok] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data: eposter } = await supabase
        .from("epost")
        .select("*")
        .or(`til.eq.${brukerId},fra.eq.${brukerId}`)
        .order("opprettet", { ascending: false });

      if (!eposter) return;

      const hovedmeldinger = eposter.filter((m) => !m.svar_paa);

      const medSvarOgVedlegg = await Promise.all(
        hovedmeldinger.map(async (m) => {
          const { data: svar } = await supabase
            .from("epost")
            .select("*")
            .eq("svar_paa", m.id)
            .order("opprettet");

          const { data: vedlegg } = await supabase
            .from("epostvedlegg_meta")
            .select("filnavn, url")
            .eq("epost_id", m.id);

          return { ...m, vedlegg: vedlegg || [], svar: svar || [] };
        })
      );

      setAlleMeldinger(medSvarOgVedlegg);
      setFiltrert(medSvarOgVedlegg);
    };

    hent();
  }, [brukerId]);

  useEffect(() => {
    const q = sok.toLowerCase();
    const filtrert = alleMeldinger.filter(
      (m) =>
        m.emne?.toLowerCase().includes(q) ||
        m.innhold?.toLowerCase().includes(q) ||
        m.fra?.toLowerCase().includes(q) ||
        m.til?.toLowerCase().includes(q)
    );
    setFiltrert(filtrert);
  }, [sok, alleMeldinger]);

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
            <li key={i} className="border p-4 rounded bg-white text-black shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p><strong>Fra:</strong> {m.fra}</p>
                  <p><strong>Til:</strong> {m.til}</p>
                </div>
                {/* Fremtidig meny:
                <div className="text-right text-sm text-gray-500 space-x-2">
                  <button className="underline">Arkiver</button>
                  <button className="underline text-red-600">Slett</button>
                </div> */}
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
