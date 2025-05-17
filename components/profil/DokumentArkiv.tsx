import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  userId: string;
};

type Dokument = {
  id: string;
  type: string;
  url: string;
  utløper?: string;
};

export default function DokumentArkiv({ userId }: Props) {
  const [dokumenter, setDokumenter] = useState<Dokument[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("dokumenter")
        .select("*")
        .eq("bruker_id", userId)
        .order("opprettet", { ascending: false });

      setDokumenter((data as Dokument[]) || []);
    };

    hent();
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-bold">Mine dokumenter</h2>

      {dokumenter.length === 0 ? (
        <p>Ingen dokumenter lastet opp ennå.</p>
      ) : (
        <ul className="space-y-2 mt-2">
          {dokumenter.map((doc) => (
            <li key={doc.id} className="border p-3 rounded bg-white text-black">
              <p><strong>Type:</strong> {doc.type}</p>
              <p>
                <strong>Fil:</strong>{" "}
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                  Last ned
                </a>
              </p>
              {doc.utløper && (
                <p><strong>Utløper:</strong> {new Date(doc.utløper).toLocaleDateString("no-NO")}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
