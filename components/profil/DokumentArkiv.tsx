import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function DokumentArkiv({ userId }: { userId: string }) {
  const [dokumenter, setDokumenter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("dokumenter")
        .select("*")
        .eq("bruker_id", userId)
        .order("opprettet", { ascending: false });
      setDokumenter(data || []);
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
          {dokumenter.map((doc, i) => (
            <li key={i} className="border p-3 rounded bg-white text-black">
              <p><strong>Type:</strong> {doc.type}</p>
              <p><strong>Fil:</strong> <a href={doc.url} target="_blank" className="underline text-blue-600">Last ned</a></p>
              {doc.utløper && <p><strong>Utløper:</strong> {new Date(doc.utløper).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
