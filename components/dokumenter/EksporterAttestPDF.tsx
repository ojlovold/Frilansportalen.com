// components/dokumenter/EksporterAttestPDF.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LastOppAttest from "./LastOppAttest"; // Viktig: relativ import

export default function EksporterAttestPDF() {
  const { user } = useUser();
  const [status, setStatus] = useState<string>("");

  const eksporterPDF = () => {
    const doc = new jsPDF();
    doc.text("Attestdokumentasjon", 14, 20);
    autoTable(doc, {
      head: [["Kolonne 1", "Kolonne 2"]],
      body: [["Eksempeldata", "Eksempelverdi"]],
      startY: 30,
    });
    doc.save("attest.pdf");
  };

  return (
    <div className="p-6">
      <Head>
        <title>Eksporter attester | Frilansportalen</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">Last opp og eksporter attest</h1>

      <LastOppAttest />

      <button
        onClick={eksporterPDF}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Eksporter til PDF
      </button>

      {status && <p className="text-red-600 mt-4">{status}</p>}
    </div>
  );
}
