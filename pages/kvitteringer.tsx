import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";

export default function Kvitteringer() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [kvitteringer, setKvitteringer] = useState<any[]>([]);
  const [valgte, setValgte] = useState<string[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("kvitteringer")
        .select("*")
        .eq("bruker_id", user.id)
        .eq("slettet", false)
        .order("dato", { ascending: false });

      const unike = Object.values(
        (data || []).reduce((acc, k) => {
          acc[k.fil_url] = k;
          return acc;
        }, {} as Record<string, any>)
      );
      setKvitteringer(unike);
    };
    hent();
  }, [user]);

  const slett = async (id: string, fil_url: string) => {
    const path = fil_url.split("/").slice(7).join("/");
    await supabase.storage.from("kvitteringer").remove([path]);
    await supabase.from("kvitteringer").update({ slettet: true }).eq("id", id);
    setKvitteringer((prev) => prev.filter((k) => k.id !== id));
  };

  const eksporterCSV = () => {
    const header = ["Dato", "Tittel", "Valuta", "Beløp", "NOK", "Fil-URL"];
    const rows = kvitteringer.map((k) => [
      k.dato,
      `"${k.tittel}"`,
      k.valuta,
      k.belop_original ?? k.belop,
      k.nok ?? (k.valuta === "NOK" ? k.belop : ""),
      k.fil_url,
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const dato = new Date().toISOString().split("T")[0];
    link.href = URL.createObjectURL(blob);
    link.download = `kvitteringer-${dato}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const eksporterPDF = () => {
    const doc = new jsPDF();
    doc.text("Kvitteringsrapport", 10, 10);
    let y = 20;
    kvitteringer.filter((k) => valgte.includes(k.id)).forEach((k) => {
      doc.text(
        `• ${k.dato} – ${k.tittel} – ${k.belop_original ?? k.belop} ${k.valuta} – NOK: ${
          k.nok ?? (k.valuta === "NOK" ? k.belop : "")
        } – ${k.fil_url}`,
        10,
        y
      );
      y += 10;
    });
    doc.save("kvitteringer-lenker.pdf");
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const eksporterPDFmedVedlegg = async () => {
    const doc = new jsPDF();
    const utvalgte = kvitteringer.filter((k) => valgte.includes(k.id));
    for (let i = 0; i < utvalgte.length; i++) {
      const k = utvalgte[i];
      doc.text(
        `${k.dato} – ${k.tittel} – ${k.belop_original ?? k.belop} ${k.valuta} – NOK: ${
          k.nok ?? (k.valuta === "NOK" ? k.belop : "")
        }`,
        10,
        10
      );
      try {
        const res = await fetch(k.fil_url);
        const blob = await res.blob();
        const imgData = await blobToBase64(blob);
        doc.addImage(imgData, "JPEG", 10, 20, 180, 200);
      } catch {
        doc.text("Kunne ikke hente bilde", 10, 30);
      }
      if (i < utvalgte.length - 1) doc.addPage();
    }
    doc.save("kvitteringer-med-bilder.pdf");
  };

  const aktive = kvitteringer.filter((k) => k.arkivert === false || k.arkivert === null);
  const arkiv = kvitteringer.filter((k) => k.arkivert === true);

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow"
        >
          ← Tilbake
        </button>

        <h1 className="text-2xl font-bold mb-4">Mine kvitteringer</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={eksporterCSV} className="bg-blue-700 text-white px-4 py-2 rounded shadow">
            Eksporter som CSV
          </button>
          <button onClick={eksporterPDF} className="bg-black text-white px-4 py-2 rounded shadow">
            Eksporter rapport (PDF med lenker)
          </button>
          <button onClick={eksporterPDFmedVedlegg} className="bg-black text-white px-4 py-2 rounded shadow">
            Eksporter bilder (PDF med vedlegg)
          </button>
        </div>

        {aktive.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Aktive kvitteringer</h2>
            <Kvitteringstabell liste={aktive} slett={slett} valgte={valgte} setValgte={setValgte} />
          </>
        )}

        {arkiv.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-2">Arkiv</h2>
            <Kvitteringstabell liste={arkiv} slett={slett} valgte={valgte} setValgte={setValgte} />
          </>
        )}
      </div>
    </div>
  );
}

function Kvitteringstabell({ liste, slett, valgte, setValgte }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border"></th>
            <th className="p-2 border">Dato</th>
            <th className="p-2 border">Tittel</th>
            <th className="p-2 border">Beløp</th>
            <th className="p-2 border">Valuta</th>
            <th className="p-2 border">I NOK</th>
            <th className="p-2 border">Fil</th>
            <th className="p-2 border">Handling</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((k: any) => (
            <tr key={k.id} className="text-center">
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={valgte.includes(k.id)}
                  onChange={() =>
                    setValgte((prev: any[]) =>
                      prev.includes(k.id) ? prev.filter((v) => v !== k.id) : [...prev, k.id]
                    )
                  }
                />
              </td>
              <td className="p-2 border">{k.dato}</td>
              <td className="p-2 border">{k.tittel}</td>
              <td className="p-2 border">{k.belop_original ?? k.belop} {k.valuta}</td>
              <td className="p-2 border">{k.valuta}</td>
              <td className="p-2 border">
                {(k.nok ?? (k.valuta === "NOK" ? k.belop : "")).toFixed?.(2)}
              </td>
              <td className="p-2 border">
                <a href={k.fil_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  Åpne
                </a>
              </td>
              <td className="p-2 border">
                <button onClick={() => slett(k.id, k.fil_url)} className="text-red-600 hover:underline">
                  Slett
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
