import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function ProsjektNotat({ prosjektId }: { prosjektId: string }) {
  const [tekst, setTekst] = useState("");
  const [notatId, setNotatId] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjektnotater")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .single();

      if (data) {
        setTekst(data.innhold);
        setNotatId(data.id);
      } else {
        const { data: ny } = await supabase
          .from("prosjektnotater")
          .insert([{ prosjekt_id: prosjektId, innhold: "" }])
          .select()
          .single();
        setNotatId(ny.id);
        setTekst("");
      }
    };

    hent();
  }, [prosjektId]);

  const lagre = async () => {
    if (!notatId) return;
    await supabase
      .from("prosjektnotater")
      .update({ innhold: tekst })
      .eq("id", notatId);
  };

  return (
    <div className="space-y-3 mt-10 bg-white p-4 border rounded">
      <h3 className="text-lg font-bold">Felles notat</h3>
      <textarea
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        onBlur={lagre}
        className="w-full border p-2 rounded min-h-[150px]"
      />
      <p className="text-sm text-gray-500">Endringer lagres automatisk når du klikker utenfor.</p>
    </div>
  );
}
