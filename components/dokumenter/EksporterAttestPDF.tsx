// components/dokumenter/EksporterAttestPDF.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LastOppAttest from "./LastOppAttest"; // ← Riktig import

export default function EksporterAttestPDF() {
  const { user } = useUser();
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchAttester();
    }
  }, [user]);

  const fetchAttester = async () => {
    try {
      const response = await fetch("/api/attester"); // valgfritt – behold hvis det brukes
      const result = await response.json();
      setData(result);
    } catch (error) {
      setStatus("Kunne ikke hente attester");
    }
  };

  const eksporterPDF = () => {
    const doc = new jsPDF();
    doc.text("Opplastede attester", 14, 20);
    autoTable(doc, {
      head: [["Filnavn", "Dato"]],
      body: data.map((item) => [item.filnavn, item.dato]),
      startY: 30,
    });
    doc.save("attester.pdf");
  };

  return (
    <div className="p-6">
      <Head>
        <title>Eksporter attester | Frilansportalen</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">Attesteksport</h1>

      <LastOppAttest />

      <button
        onClick={eksporterPDF}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Last ned som PDF
      </button>

      {status && <p className="text-red-600 mt-4">{status}</p>}
    </div>
  );
}
