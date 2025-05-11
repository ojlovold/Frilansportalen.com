import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function LeggTilDugnad() {
  const [type, setType] = useState("ber om hjelp");
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [kategori, setKategori] = useState("");
  const [sted, setSted] = useState("");
  const [frist, setFrist] = useState("");
  const [status, setStatus] = useState("");

  const les = (tekst: string) => {
    if (typeof window !== "undefined" && window.lesTekst) {
      window.lesTekst(tekst);
    }
  };

  const getPris = () => {
    if (type === "sommerjobb") return 100;
    if (type === "småjobb") return 50;
    return 0;
  };

  const lagre = async () => {
    const pris = getPris();
    if (!tittel || !beskrivelse) {
      setStatus("Tittel og beskrivelse må fylles ut.");
      return;
    }

    if (pris > 0) {
      setStatus(`Denne typen krever betaling (${pris} kr).`);
      return;
    }

    const { error } = await supabase.from("dugnader").insert([
      {
        type,
        tittel,
        beskrivelse,
        kategori,
        sted,
        frist,
      },
    ]);

    setStatus(error ? "Kunne ikke lagre dugnad" : "Dugnad publisert!");
    if (!error) {
      setType("ber om hjelp");
      setTittel("");
      setBeskrivelse("");
      setKategori("");
      setSted("");
      setFrist("");
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded shadow">
      <h2 className="text-lg font-bold">Legg ut dugnadsoppdrag</h2>

      <label onMouseEnter={() => les("Velg type")} className="block font-medium">Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        onFocus={() => les("Velg dugnadstype")}
        className="w-full border p-2 rounded"
      >
        <option value="ber om hjelp">Jeg ber om hjelp (gratis)</option>
        <option value="tilbyr hjelp">Jeg tilbyr hjelp (gratis)</option>
        <option value="sommerjobb">Sommerjobb (100 kr)</option>
        <option value="småjobb">Småjobb (50 kr)</option>
      </select>

      {getPris() > 0 && (
        <p className="text-sm text-red-600">Denne dugnaden koster {getPris()} kr å publisere</p>
      )}

      <label onMouseEnter={() => les("Tittel")} className="block font-medium">Tittel</label>
      <input
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        onFocus={() => les("Skriv inn tittel for oppdraget")}
        className="w-full border p-2 rounded"
      />

      <label onMouseEnter={() => les("Beskrivelse")} className="block font-medium">Beskrivelse</label>
      <textarea
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        onFocus={() => les("Beskriv hva dugnaden gjelder")}
        className="w-full border p-2 rounded"
      />

      <label onMouseEnter={() => les("Kategori")} className="block font-medium">Kategori</label>
      <input
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        onFocus={() => les("F.eks. snømåking, barnevakt")}
        className="w-full border p-2 rounded"
      />

      <label onMouseEnter={() => les("Sted")} className="block font-medium">Sted</label>
      <input
        value={sted}
        onChange={(e) => setSted(e.target.value)}
        onFocus={() => les("F.eks. Oslo, Trondheim, Sogn")}
        className="w-full border p-2 rounded"
      />

      <label onMouseEnter={() => les("Frist")} className="block font-medium">Frist</label>
      <input
        type="date"
        value={frist}
        onChange={(e) => setFrist(e.target.value)}
        onFocus={() => les("Velg dato for frist")}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={lagre}
        onMouseEnter={() => les("Publiser dugnad")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Publiser dugnad
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
