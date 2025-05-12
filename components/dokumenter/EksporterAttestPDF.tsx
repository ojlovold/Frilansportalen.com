import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import LastOppAttest from "@/components/dokumenter/LastOppAttest";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Attest {
  id: string;
  tittel: string;
  utsteder: string;
  dato: string;
  status: string;
}

export default function EksporterAttestPDF() {
  const { user } = useUser();
  const [attester, setAttester] = useState<Attest[]>([]);

  useEffect(() => {
    const hentAttester = async () => {
      if (!user?.id) return;

      const res = await fetch(`/api/attester?user_id=${user.id}`);
      const data = await res.json();
      setAttester(data);
    };

    hentAttester();
  }, [user]);

  const lastNedPDF = () => {
    const doc = new jsPDF();
    const dato = new Date().toLocaleDateString("no-NO");

    doc.setFontSize(18);
    doc.text("Mine attester", 14, 20);
    doc.setFontSize(11);
    doc.text(`Dato: ${dato}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Tittel", "Utsteder", "Dato", "Status"]],
      body: attester.map((a) => [a.tittel, a.utsteder, a.dato, a.status]),
    });

    doc.save(`attester_${Date.now()}.pdf`);
  };

  return (
    <>
      <Head>
        <title>Eksporter attester | Frilansportalen</title>
      </Head>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Eksporter attester</h1>
        <LastOppAttest />
        <button
          onClick={lastNedPDF}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Last ned som PDF
        </button>
      </div>
    </>
  );
}
