// pages/admin/regnskap.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminWrapper from "@/components/AdminWrapper";

export default function AdminRegnskap() {
  const [inntekter, setInntekter] = useState<any[]>([]);
  const [sumInntekt, setSumInntekt] = useState<number>(0);
  const [utgifter, setUtgifter] = useState<any[]>([]);
  const [utgift, setUtgift] = useState({
    tittel: "",
    belop: 0,
    valuta: "NOK",
    dato: "",
    fil: null as File | null,
    nok: 0,
  });
  const [status, setStatus] = useState<"klar" | "lagret" | "feil">("klar");

  useEffect(() => {
    const hent = async () => {
      const { data: inntekter } = await supabase.from("transaksjoner").select("*");
      const { data: utgifter } = await supabase.from("admin_utgifter").select("*");
      setInntekter(inntekter || []);
      setUtgifter(utgifter || []);
      const sum = inntekter?.reduce((acc, curr) => acc + (curr.belop || 0), 0) || 0;
      setSumInntekt(sum);
    };
    hent();
  }, []);

  const hentValutakurs = async (valuta: string, dato: string) => {
    const url = `https://api.frankfurter.app/${dato}?from=${valuta}&to=NOK`;
    const res = await fetch(url);
    const data = await res.json();
    return data.rates?.NOK || 0;
  };

  const lastOppUtgift = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("klar");
    let nokBelop = utgift.belop;

    if (utgift.valuta !== "NOK") {
      const kurs = await hentValutakurs(utgift.valuta, utgift.dato);
      nokBelop = utgift.belop * kurs;
    }

    let fil_url = null;
    if (utgift.fil) {
      const filnavn = `utgifter/${Date.now()}-${utgift.fil.name}`;
      const { error: uploadError } = await supabase.storage
        .from("dokumenter")
        .upload(filnavn, utgift.fil, { upsert: true });

      if (uploadError) return setStatus("feil");

      const { data: urlData } = supabase.storage.from("dokumenter").getPublicUrl(filnavn);
      fil_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("admin_utgifter").insert([
      {
        tittel: utgift.tittel,
        belop: utgift.belop,
        valuta: utgift.valuta,
        dato: utgift.dato,
        nok: nokBelop,
        fil_url,
      },
    ]);

    if (error) setStatus("feil");
    else {
      setUtgift({ tittel: "", belop: 0, valuta: "NOK", dato: "", fil: null, nok: 0 });
      setStatus("lagret");
    }
  };

  const slettUtgift = async (id: string) => {
    await supabase.from("admin_utgifter").delete().eq("id", id);
    setUtgifter((prev) => prev.filter((u) => u.id !== id));
  };

  const lastNedUtgifterCSV = () => {
    if (utgifter.length === 0) return;
    const header = Object.keys(utgifter[0]).join(",");
    const rows = utgifter.map((u) =>
      Object.values(u).map((v) => `"${(v ?? "").toString().replaceAll("\"", '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utgifter.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalUtgiftNOK = utgifter.reduce((acc, u) => acc + (u.nok || 0), 0);
  const netto = sumInntekt - totalUtgiftNOK;

  return (
    <AdminWrapper title="Regnskap og rapportering">
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Inntekter</h2>
          <p className="text-sm text-gray-700 mb-4">Inntekter fra portalen (Stripe, Vipps)</p>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl">
            <p className="text-sm">Totalt: {sumInntekt.toFixed(2)} kr</p>
            <p className="text-sm">MVA (25%): {(sumInntekt * 0.25).toFixed(2)} kr</p>
            {sumInntekt >= 50000 && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                Du har passert 50 000 kr i inntekt. Du må nå registrere virksomheten i Merverdiavgiftsregisteret.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Utgifter og kvitteringer</h2>
          <form className="space-y-4 bg-white p-4 rounded-xl shadow max-w-3xl" onSubmit={lastOppUtgift}>
            <input type="text" placeholder="Tittel" value={utgift.tittel} onChange={(e) => setUtgift({ ...utgift, tittel: e.target.value })} className="w-full border rounded p-2" />
            <input type="number" step="any" placeholder="Beløp" value={utgift.belop} onChange={(e) => setUtgift({ ...utgift, belop: parseFloat(e.target.value) })} className="w-full border rounded p-2" />
            <input type="text" placeholder="Valuta" value={utgift.valuta} onChange={(e) => setUtgift({ ...utgift, valuta: e.target.value })} className="w-full border rounded p-2" />
            <input type="date" value={utgift.dato} onChange={(e) => setUtgift({ ...utgift, dato: e.target.value })} className="w-full border rounded p-2" />
            <input type="file" accept=".jpg,.png,.pdf" onChange={(e) => setUtgift({ ...utgift, fil: e.target.files?.[0] || null })} className="w-full" />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded">Last opp utgift</button>
            {status === "lagret" && <p className="text-green-600">Utgift lagret.</p>}
            {status === "feil" && <p className="text-red-600">Feil ved lagring.</p>}
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Oversikt</h2>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl space-y-2">
            <p className="text-sm">Totale utgifter: {totalUtgiftNOK.toFixed(2)} kr</p>
            <p className="text-sm">Netto resultat: {netto.toFixed(2)} kr</p>
            <button onClick={lastNedUtgifterCSV} className="text-sm bg-black text-white px-3 py-1 rounded mt-2">Last ned CSV</button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Utgiftshistorikk</h2>
          <div className="overflow-auto max-w-6xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Dato</th>
                  <th className="text-left p-2">Tittel</th>
                  <th className="text-left p-2">Beløp</th>
                  <th className="text-left p-2">Valuta</th>
                  <th className="text-left p-2">NOK</th>
                  <th className="text-left p-2">Kvittering</th>
                  <th className="text-left p-2">Handling</th>
                </tr>
              </thead>
              <tbody>
                {utgifter.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.dato}</td>
                    <td className="p-2">{u.tittel}</td>
                    <td className="p-2">{u.belop}</td>
                    <td className="p-2">{u.valuta}</td>
                    <td className="p-2">{u.nok.toFixed(2)}</td>
                    <td className="p-2">
                      {u.fil_url ? (
                        <a href={u.fil_url} target="_blank" className="text-blue-600 underline">Vis</a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-2">
                      <button onClick={() => slettUtgift(u.id)} className="text-red-600 hover:underline">Slett</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminWrapper>
  );
}
