import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

const supabase = createBrowserSupabaseClient();

export default function KvitteringsModul() {
  const [fil, setFil] = useState<File | null>(null);
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [status, setStatus] = useState("");
  const [liste, setListe] = useState<any[]>([]);

  const user = useUser();
  const brukerHarPremium = user?.user_metadata?.premium === true;

  useEffect(() => {
    const hentUtgifter = async () => {
      if (!user || !brukerHarPremium) return;

      const { data } = await supabase
        .from("admin_utgifter")
        .select("*")
        .eq("bruker_id", user.id)
        .order("opprettet", { ascending: false });

      if (data) setListe(data);
    };

    hentUtgifter();
  }, [status]);

  const handterFilvalg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFil(e.target.files[0]);
      setStatus("");
    }
  };

  const lastOpp = async () => {
    if (!brukerHarPremium) {
      setStatus("Funksjonen er kun tilgjengelig for Premium-brukere.");
      return;
    }

    if (!user?.id) {
      setStatus("Bruker-ID mangler. Vennligst logg inn på nytt.");
      return;
    }

    console.log("Bruker-ID som sendes:", user.id);

    if (!fil || !tittel || !belop) {
      setStatus("Fyll ut alle felt og velg en fil.");
      return;
    }

    const safeFilename = fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
    const path = `admin/${Date.now()}-${safeFilename}`;

    const { error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Feil ved opplasting: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("kvitteringer")
      .getPublicUrl(path);

    const { error: dbError } = await supabase.from("admin_utgifter").insert({
      bruker_id: user.id,
      tittel,
      belop,
      valuta: "NOK",
      fil_url: urlData?.publicUrl ?? "",
    });

    if (dbError) {
      setStatus("Fil lastet opp, men feil ved lagring i database.");
    } else {
      setStatus("Kvittering registrert!");
      setTittel("");
      setBelop("");
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
        placeholder="Bel\u00f8p"
        value={belop}
        onChange={(e) => setBelop(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input type="file" onChange={handterFilvalg} className="mb-2 w-full" />
      <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
        Last opp utgift
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}

      {user?.id && (
        <p className="text-xs text-gray-500">
          Bruker-ID: <span className="font-mono">{user.id}</span>
        </p>
      )}

      <hr className="my-6" />
      <h3 className="text-lg font-semibold mb-2">Tidligere utgifter</h3>
      <ul className="text-sm space-y-2">
        {liste.map((rad) => (
          <li key={rad.id} className="flex justify-between items-center border-b pb-1">
            <span>{rad.tittel} – {rad.belop} {rad.valuta}</span>
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
