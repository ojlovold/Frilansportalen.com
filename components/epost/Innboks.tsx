import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Epost = {
  id: string;
  fra: string;
  til: string;
  innhold: string;
  opprettet: string;
  vedlegg?: { url: string; filnavn: string }[];
};

type Props = {
  brukerId: string;
};

export default function EpostInnboks({ brukerId }: Props) {
  const [meldinger, setMeldinger] = useState<Epost[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from("epost")
        .select("*")
        .eq("til", brukerId)
        .order("opprettet", { ascending: false });

      if (!error && data) {
        setMeldinger(data);
      } else {
        console.error("Feil ved henting av e-post:", error?.message);
      }
    };

    hent();
  }, [brukerId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Innboks</h2>

      {meldinger.length === 0 ? (
        <p>Ingen meldinger funnet.</p>
      ) : (
        meldinger.map((m) => (
          <div key={m.id} className="mb-6 border-b pb-4">
            <p className="text-sm text-gray-500">
              Fra: {m.fra} – {new Date(m.opprettet).toLocaleString("no-NO")}
            </p>
            <p className="mt-2">{m.innhold}</p>

            {Array.isArray(m.vedlegg) && m.vedlegg.length > 0 && (
              <div className="mt-3">
                <strong>Vedlegg:</strong>
                <ul className="list-disc list-inside">
                  {m.vedlegg.map((v, i) => (
                    <li key={i}>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {v.filnavn}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
