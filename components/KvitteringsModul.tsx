import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function KvitteringsModul() {
  const [fil, setFil] = useState<File | null>(null);
  const [tittel, setTittel] = useState("");
  const [beløp, setBeløp] = useState("");
  const [status, setStatus] = useState("");
  const [liste, setListe] = useState<any[]>([]);

  useEffect(() => {
    const hentUtgifter = async () => {
      const { data } = await supabase
        .from("admin_utgifter")
        .select("*")
        .order("opprettet", { ascending: false });
      if (data) setListe(data);
    };

    hentUtgifter();
  }, [status]);

  const håndterFilvalg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFil(e.target.files[0]);
      setStatus("");
    }
  };

  const lastOpp = async () => {
    if (!fil || !tittel || !beløp) {
      setStatus("Fyll ut alle felt og velg en fil.");
      return;
    }

    const safeFilename = fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
    const path = `admin/${Date.now()}-${safeFilename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Feil ved opplasting: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("kvitteringer")
      .getPublicUrl(path); // Bruk .getPublicUrl hvis bucket er public – eller signedUrl hvis ikke

    const { error: dbError } = await supabase.from("admin_utgifter").insert({
      tittel,
      beløp,
      valuta: "NOK",
      fil_url: urlData?.publicUrl ?? "",
    });

    if (dbError) {
      setStatus("Fil lastet opp, men feil ved lagring i database.");
    } else {
      setStatus("Kvittering registrert!");
      setTittel("");
      setBeløp("");
      setFil(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Last opp kvittering</h2>

      <input
        type="text"
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Beløp"
        value={beløp}
        onChange={(e) => setBeløp(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input type="file" onChange={håndterFilvalg} className="mb-2 w-full" />
      <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
        Last opp utgift
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}

      <hr className="my-6" />
      <h3 className="text-lg font-semibold mb-2">Tidligere utgifter</h3>
      <ul className="text-sm space-y-2">
        {liste.map((rad) => (
          <li key={rad.id} className="flex justify-between items-center border-b pb-1">
            <span>{rad.tittel} – {rad.beløp} {rad.valuta}</span>
            {rad.fil_url && (
              <a href={rad.fil_url} target="_blank" rel="noopener noreferrer" className="underline">
                Vis kvittering
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
