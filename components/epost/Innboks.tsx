import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { Bell } from "lucide-react";
import getNotifications from "../lib/getNotifications";

interface Epost {
  id: string;
  fra: string;
  til: string;
  innhold: string;
  opprettet: string;
  vedlegg?: { url: string; filnavn: string }[];
}

export default function Innboks() {
  const user = useUser();
  const [meldinger, setMeldinger] = useState<Epost[]>([]);

  useEffect(() => {
    const hent = async () => {
      const brukerId = user && 'id' in user ? (user.id as string) : null;
      if (!brukerId) return;

      const { data } = await supabase
        .from("epost")
        .select("*")
        .eq("til", brukerId)
        .order("opprettet", { ascending: false });

      setMeldinger(data || []);
    };

    hent();
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Innboks</h2>

      {meldinger.map((m) => (
        <div key={m.id} className="mb-6 border-b pb-4">
          <p className="text-sm text-gray-500">
            Fra: {m.fra} – {new Date(m.opprettet).toLocaleString("no-NO")}
          </p>
          <p className="mt-2">{m.innhold}</p>

          {/* Fikset vedlegg-sjekk */}
          {Array.isArray(m.vedlegg) && m.vedlegg.length > 0 && (
            <div className="mt-3">
              <strong>Vedlegg:</strong>
              <ul className="list-disc list-inside">
                {m.vedlegg.map((v, i) => (
                  <li key={i}>
                    <a
                      href={v.url}
                      target="_blank"
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
      ))}
    </div>
  );
}
