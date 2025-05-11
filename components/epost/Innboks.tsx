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
}

interface Vedlegg {
  filnavn: string;
  url: string;
}

export default function EpostInnboks({ brukerId }: { brukerId: string }) {
  const [meldinger, setMeldinger] = useState<Epost[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data: eposter } = await supabase
        .from("epost")
        .select("*")
        .or(`til.eq.${brukerId},fra.eq.${brukerId}`)
        .order("opprettet", { ascending: false });

      if (!eposter) return;

      const meldingerMedVedlegg = await Promise.all(
        eposter.map(async (m) => {
          const { data: vedlegg } = await supabase
            .from("epostvedlegg_meta")
            .select("filnavn, url")
            .eq("epost_id", m.id);

          return { ...m, vedlegg: vedlegg || [] };
        })
      );

      setMeldinger(meldingerMedVedlegg);
    };

    hent();
  }, [brukerId]);

  return (
    <div>
      <h2 className="text-xl font-bold">Innboks</h2>
      {meldinger.length === 0 ? (
        <p>Du har ingen e-postmeldinger ennå.</p>
      ) : (
        <ul className="space-y-6 mt-4">
          {meldinger.map((m, i) => (
            <li key={i} className="border p-4 rounded bg-white text-black shadow-sm">
              <p><strong>Fra:</strong> {m.fra}</p>
              <p><strong>Til:</strong> {m.til}</p>
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

              {/* Svarboks vises bare hvis brukeren er mottaker */}
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
