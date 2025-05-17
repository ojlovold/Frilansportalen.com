import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

type Svar = {
  navn: string;
  kommentar: string;
};

export default function DugnadSvarListe({ dugnadId }: { dugnadId: string }) {
  const user = useUser();
  const [svar, setSvar] = useState<Svar[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hentSvar = async () => {
      if (!user || !dugnadId) return;

      const { data, error } = await supabase
        .from("dugnadsvar")
        .select("navn, kommentar")
        .eq("dugnad_id", dugnadId);

      if (error) {
        setStatus("Feil ved henting: " + error.message);
      } else {
        setSvar(data || []);
      }
    };

    hentSvar();
  }, [user, dugnadId]);

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Innsendte svar</h2>

      {status && <p className="text-red-600 mb-4">{status}</p>}

      {svar.length === 0 ? (
        <p>Ingen har svart ennå.</p>
      ) : (
        <ul className="space-y-2">
          {svar.map((s, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-semibold">{s.navn}</p>
              <p className="text-sm text-gray-700">{s.kommentar}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
