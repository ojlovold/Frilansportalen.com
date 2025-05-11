import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Kontrakt {
  id: string;
  filnavn: string;
  url: string;
  oppretter: string;
  mottaker: string;
  status: string;
  signert_oppretter: boolean;
  signert_mottaker: boolean;
}

export default function MineKontrakter({ brukerId }: { brukerId: string }) {
  const [kontrakter, setKontrakter] = useState<Kontrakt[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("kontrakter")
        .select("*")
        .or(`oppretter.eq.${brukerId},mottaker.eq.${brukerId}`)
        .not("slettet", "is", true)
        .order("opprettet", { ascending: false });

      setKontrakter(data || []);
    };

    hent();
  }, [brukerId]);

  const signer = async (id: string, rolle: "oppretter" | "mottaker") => {
    const felt = rolle === "oppretter" ? "signert_oppretter" : "signert_mottaker";

    await supabase
      .from("kontrakter")
      .update({ [felt]: true })
      .eq("id", id);

    // Oppdater status
    const kontrakt = kontrakter.find((k) => k.id === id);
    const beggeSignert =
      kontrakt?.signert_oppretter === true || rolle === "oppretter"
        ? kontrakt?.signert_mottaker || rolle === "mottaker"
        : false;

    await supabase
      .from("kontrakter")
      .update({ status: beggeSignert ? "signert" : "venter" })
      .eq("id", id);

    setKontrakter((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, [felt]: true, status: beggeSignert ? "signert" : "venter" } : k
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Mine kontrakter</h2>

      {kontrakter.length === 0 ? (
        <p>Ingen kontrakter funnet.</p>
      ) : (
        <ul className="space-y-4">
          {kontrakter.map((k) => {
            const erOppretter = k.oppretter === brukerId;
            const erMottaker = k.mottaker === brukerId;

            return (
              <li key={k.id} className="border p-4 rounded bg-white text-black shadow-sm">
                <p><strong>Fil:</strong> <a href={k.url} target="_blank" className="underline text-blue-600">{k.filnavn}</a></p>
                <p><strong>Status:</strong> {k.status}</p>
                <p><strong>Signert av oppretter:</strong> {k.signert_oppretter ? "Ja" : "Nei"}</p>
                <p><strong>Signert av mottaker:</strong> {k.signert_mottaker ? "Ja" : "Nei"}</p>

                {erOppretter && !k.signert_oppretter && (
                  <button onClick={() => signer(k.id, "oppretter")} className="bg-black text-white px-4 py-2 mt-2 rounded">
                    Signer som oppretter
                  </button>
                )}

                {erMottaker && !k.signert_mottaker && (
                  <button onClick={() => signer(k.id, "mottaker")} className="bg-black text-white px-4 py-2 mt-2 rounded">
                    Signer som mottaker
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
