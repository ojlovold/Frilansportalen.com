import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Kvitteringer() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [kvitteringer, setKvitteringer] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [valgte, setValgte] = useState<string[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("kvitteringer")
        .select("*")
        .eq("bruker_id", user.id)
        .order("dato", { ascending: false });
      if (!error) setKvitteringer(data);
    };
    hent();
  }, [user]);

  const slett = async (id: string, fil_url: string) => {
    const bekreft = confirm("Slette kvittering permanent?");
    if (!bekreft) return;
    const path = fil_url.split("/").slice(7).join("/");
    await supabase.storage.from("kvitteringer").remove([path]);
    await supabase.from("kvitteringer").delete().eq("id", id);
    setKvitteringer((prev) => prev.filter((k) => k.id !== id));
  };

  const lagPDF = () => {
    const pdf = new jsPDF();
    autoTable(pdf, {
      head: [["Dato", "Tittel", "Beløp", "Valuta"]],
      body: kvitteringer.map((k) => [
        k.dato,
        k.tittel,
        k.belop,
        k.valuta,
      ]),
    });
    pdf.save("kvitteringer.pdf");
  };

  const skrivUt = () => {
    window.print();
  };

  const toggleValgt = (id: string) => {
    setValgte((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const visVedlegg = () => {
    const valgteUrls = kvitteringer
      .filter((k) => valgte.includes(k.id))
      .map((k) => k.fil_url);
    setStatus("Vedlegg:\n" + valgteUrls.join("\n"));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Mine kvitteringer</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={lagPDF} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
          Last ned PDF
        </button>
        <button onClick={skrivUt} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
          Skriv ut
        </button>
        <button onClick={visVedlegg} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow">
          Vis vedlegg for e-post
        </button>
      </div>

      {status && (
        <pre className="bg-gray-100 p-3 mb-4 text-sm whitespace-pre-wrap rounded">
          {status}
        </pre>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border"></th>
            <th className="p-2 border">Dato</th>
            <th className="p-2 border">Tittel</th>
            <th className="p-2 border">Beløp</th>
            <th className="p-2 border">Valuta</th>
            <th className="p-2 border">Fil</th>
            <th className="p-2 border">Handling</th>
          </tr>
        </thead>
        <tbody>
          {kvitteringer.map((k) => (
            <tr key={k.id} className="text-center">
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={valgte.includes(k.id)}
                  onChange={() => toggleValgt(k.id)}
                />
              </td>
              <td className="p-2 border">{k.dato}</td>
              <td className="p-2 border">{k.tittel}</td>
              <td className="p-2 border">{k.belop}</td>
              <td className="p-2 border">{k.valuta}</td>
              <td className="p-2 border">
                <a href={k.fil_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  Åpne
                </a>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => slett(k.id, k.fil_url)}
                  className="text-red-600 hover:underline"
                >
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
