// pages/admin/regnskap.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminWrapper from "@/components/AdminWrapper";

export default function AdminRegnskap() {
  const [inntekter, setInntekter] = useState<any[]>([]);
  const [sumInntekt, setSumInntekt] = useState<number>(0);
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
      const { data } = await supabase.from("transaksjoner").select("*");
      setInntekter(data || []);
      const sum = data?.reduce((acc, curr) => acc + (curr.belop || 0), 0) || 0;
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

  const kalkulerNOK = async () => {
    if (utgift.valuta === "NOK") {
      setUtgift({ ...utgift, nok: utgift.belop });
    } else if (utgift.dato && utgift.belop > 0) {
      const kurs = await hentValutakurs(utgift.valuta, utgift.dato);
      const konvertert = utgift.belop * kurs;
      setUtgift({ ...utgift, nok: konvertert });
    }
  };

  return (
    <AdminWrapper title="Regnskap og rapportering">
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Inntekter</h2>
          <p className="text-sm text-gray-700 mb-4">
            Her vises dine inntekter fra portalen, inkludert betalinger via Stripe og Vipps.
          </p>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl">
            <p className="text-sm">Totalt: {sumInntekt.toFixed(2)} kr</p>
            <p className="text-sm">MVA (25%): {(sumInntekt * 0.25).toFixed(2)} kr</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Utgifter og kvitteringer</h2>
          <p className="text-sm text-gray-700 mb-4">
            Du kan laste opp kjøp i alle valutaer. Systemet vil automatisk hente valutakurs og regne ut NOK-verdi.
          </p>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                kalkulerNOK();
              }}
            >
              <input
                type="text"
                placeholder="Tittel / beskrivelse"
                value={utgift.tittel}
                onChange={(e) => setUtgift({ ...utgift, tittel: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                step="any"
                placeholder="Beløp"
                value={utgift.belop}
                onChange={(e) => setUtgift({ ...utgift, belop: parseFloat(e.target.value) })}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Valuta (f.eks. EUR, USD, GBP)"
                value={utgift.valuta}
                onChange={(e) => setUtgift({ ...utgift, valuta: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="date"
                value={utgift.dato}
                onChange={(e) => setUtgift({ ...utgift, dato: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="file"
                accept=".jpg,.png,.pdf"
                onChange={(e) => setUtgift({ ...utgift, fil: e.target.files?.[0] || null })}
                className="w-full"
              />
              <p className="text-sm">Kalkulert NOK: {utgift.nok.toFixed(2)} kr</p>
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded"
              >
                Kalkuler verdi
              </button>
              {status === "lagret" && (
                <p className="text-green-600">Utgift lagret.</p>
              )}
              {status === "feil" && (
                <p className="text-red-600">Feil ved lagring.</p>
              )}
            </form>
          </div>
        </section>
      </div>
    </AdminWrapper>
  );
}
