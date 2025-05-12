// components/dokumenter/MineAttester.tsx
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient"; // ← Fikset sti

interface Attest {
  id: string;
  navn: string;
  url: string;
  dato: string;
}

export default function MineAttester() {
  const [attester, setAttester] = useState<Attest[]>([]);
  const [feil, setFeil] = useState("");

  useEffect(() => {
    const hentAttester = async () => {
      const { data, error } = await supabase
        .from("attester")
        .select("*")
        .order("dato", { ascending: false });

      if (error) {
        setFeil("Kunne ikke hente attester");
      } else {
        setAttester(data);
      }
    };

    hentAttester();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Mine attester</h2>

      {feil && <p className="text-red-600">{feil}</p>}

      <ul className="space-y-2">
        {attester.map((attest) => (
          <li key={attest.id} className="border p-3 rounded bg-white shadow">
            <p className="font-medium">{attest.navn}</p>
            <p className="text-sm text-gray-600">{attest.dato}</p>
            <a
              href={attest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Åpne
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
