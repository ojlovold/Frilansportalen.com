import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Attest {
  id: string;
  type: string;
  filnavn: string;
  url: string;
  utløper: string;
  opplastet: string;
}

export default function MineAttester({ brukerId }: { brukerId: string }) {
  const [attester, setAttester] = useState<Attest[]>([]);
  const [opplasting, setOpplasting] = useState<{ [id: string]: File | null }>({});

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("attester")
        .select("*")
        .eq("bruker_id", brukerId)
        .order("utløper", { ascending: true });

      setAttester(data || []);
    };

    hent();
  }, [brukerId]);

  const dagerIgjen = (datoStr: string) => {
    const utløpsdato = new Date(datoStr);
    const iDag = new Date();
    const diff = Math.ceil((utløpsdato.getTime() - iDag.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const slettAttest = async (attestId: string, type: string) => {
    await supabase.from("attester").delete().eq("id", attestId);

    await supabase
      .from("varsler")
      .delete()
      .eq("bruker_id", brukerId)
      .eq("type", "attest")
      .like("tekst", `%${type}%`);

    setAttester((prev) => prev.filter((a) => a.id !== attestId));
  };

  const erstatt = async (attest: Attest) => {
    const ny = opplasting[attest.id];
    if (!ny) return;

    const path = `${brukerId}/${Date.now()}_${ny.name}`;
    const { error: uploadError } = await supabase.storage
      .from("attester")
      .upload(path, ny, { upsert: true });

    if (uploadError) return;

    const url = supabase.storage.from("attester").getPublicUrl(path).data.publicUrl;

    await supabase.from("attester").update({
      url,
      filnavn: ny.name,
      opplastet: new Date().toISOString(),
    }).eq("id", attest.id);

    await supabase
      .from("varsler")
      .delete()
      .eq("bruker_id", brukerId)
      .eq("type", "attest")
      .like("tekst", `%${attest.type}%`);

    setOpplasting((prev) => ({ ...prev, [attest.id]: null }));

    const { data } = await supabase
      .from("attester")
      .select("*")
      .eq("bruker_id", brukerId);

    setAttester(data || []);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Mine attester og sertifikater</h2>

      {attester.length === 0 ? (
        <p>Ingen attester funnet.</p>
      ) : (
        <ul className="space-y-4">
          {attester.map((a) => {
            const diff = dagerIgjen(a.utløper);
            const farge =
              diff < 0 ? "text-red-600" : diff <= 30 ? "text-orange-500" : "text-green-700";

            return (
              <li key={a.id} className="border p-4 rounded bg-white text-black shadow-sm">
                <p><strong>Type:</strong> {a.type}</p>
                <p><strong>Fil:</strong> <a href={a.url} target="_blank" className="underline text-blue-600">{a.filnavn}</a></p>
                <p className={farge}><strong>Utløper:</strong> {new Date(a.utløper).toLocaleDateString()} ({diff} dager igjen)</p>
                <p className="text-sm text-gray-500">Opplastet: {new Date(a.opplastet).toLocaleDateString()}</p>

                <div className="mt-3 flex gap-4">
                  <button onClick={() => slettAttest(a.id, a.type)} className="text-red-600 underline">
                    Slett
                  </button>

                  <div>
                    <input
                      type="file"
                      onChange={(e) =>
                        setOpplasting((prev) => ({
                          ...prev,
                          [a.id]: e.target.files?.[0] || null,
                        }))
                      }
                    />
                    <button
                      onClick={() => erstatt(a)}
                      className="mt-1 text-blue-600 underline"
                    >
                      Erstatt fil
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
