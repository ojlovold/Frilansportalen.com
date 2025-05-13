// components/prosjekt/ProsjektNotat.tsx
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type Props = {
  prosjektId: string;
};

export default function ProsjektNotat({ prosjektId }: Props) {
  const [tekst, setTekst] = useState("");
  const [notatId, setNotatId] = useState<string | null>(null);
  const [laster, setLaster] = useState(true);

  useEffect(() => {
    const hentNotat = async () => {
      setLaster(true);
      const { data, error } = await supabase
        .from("prosjektnotater")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .maybeSingle();

      if (error) {
        console.error("Feil ved henting av notat:", error.message);
        setLaster(false);
        return;
      }

      if (data) {
        setTekst(data.innhold || "");
        setNotatId(data.id);
      } else {
        const { data: ny } = await supabase
          .from("prosjektnotater")
          .insert([{ prosjekt_id: prosjektId, innhold: "" }])
          .select()
          .single();

        if (ny) {
          setNotatId(ny.id);
          setTekst("");
        }
      }

      setLaster(false);
    };

    hentNotat();
  }, [prosjektId]);

  const lagre = async () => {
    if (!notatId) return;
    const { error } = await supabase
      .from("prosjektnotater")
      .update({ innhold: tekst })
      .eq("id", notatId);

    if (error) console.error("Feil ved lagring av notat:", error.message);
  };

  return (
    <div className="space-y-3 mt-10 bg-white p-4 border rounded">
      <h3 className="text-lg font-bold">Felles notat</h3>
      {laster ? (
        <p>Laster notat...</p>
      ) : (
        <>
          <textarea
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            onBlur={lagre}
            className="w-full border p-2 rounded min-h-[150px]"
          />
          <p className="text-sm text-gray-500">
            Endringer lagres automatisk når du klikker utenfor.
          </p>
        </>
      )}
    </div>
  );
}
