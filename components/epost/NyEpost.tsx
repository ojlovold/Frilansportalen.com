import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  fraId: string;
};

export default function NyEpost({ fraId }: Props) {
  const [til, setTil] = useState("");
  const [emne, setEmne] = useState("");
  const [innhold, setInnhold] = useState("");
  const [filer, setFiler] = useState<FileList | null>(null);
  const [status, setStatus] = useState("");

  const send = async () => {
    if (!til || !innhold) {
      setStatus("Mottaker og innhold må fylles ut.");
      return;
    }

    const { data: epost, error } = await supabase
      .from("epost")
      .insert([{ fra: fraId, til, emne, innhold }])
      .select("id")
      .single();

    if (error || !epost) {
      setStatus("Kunne ikke sende e-post.");
      return;
    }

    const epostId = epost.id;

    if (filer) {
      for (const fil of Array.from(filer)) {
        const path = `epost/${fraId}/${Date.now()}_${fil.name}`;
        const { error: uploadError } = await supabase.storage
          .from("epostvedlegg")
          .upload(path, fil);

        if (!uploadError) {
          const publicUrl = supabase.storage.from("epostvedlegg").getPublicUrl(path).data.publicUrl;

          await supabase.from("epostvedlegg_meta").insert([
            {
              epost_id: epostId,
              filnavn: fil.name,
              url: publicUrl,
            },
          ]);
        }
      }
    }

    await supabase.from("varsler").insert([
      {
        bruker_id: til,
        type: "epost",
        tekst: `Ny e-post fra ${fraId}`,
        lenke: "/epost",
      },
    ]);

    const { data: bruker } = await supabase
      .from("brukerprofiler")
      .select("epost")
      .eq("id", til)
      .single();

    if (bruker?.epost) {
      await fetch("/api/send-varsling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: bruker.epost,
          subject: "Ny melding i Frilansportalen",
          text: `Du har fått ny e-post. Logg inn for å lese den.`,
        }),
      });
    }

    setTil("");
    setEmne("");
    setInnhold("");
    setFiler(null);
    setStatus("E-post sendt!");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Send ny e-post</h2>

      <input
        type="text"
        placeholder="Mottaker bruker-ID"
        value={til}
        onChange={(e) => setTil(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Emne"
        value={emne}
        onChange={(e) => setEmne(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Meldingstekst"
        value={innhold}
        onChange={(e) => setInnhold(e.target.value)}
        className="w-full border p-2 rounded min-h-[120px]"
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiler(e.target.files)}
        className="block w-full border p-2 rounded"
      />

      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Send e-post
      </button>
      <p>{status}</p>
    </div>
  );
}
