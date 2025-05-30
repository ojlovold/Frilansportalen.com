// pages/pdf.tsx
import Head from "next/head";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { brukerHarPremium } from "../utils/brukerHarPremium";
import PremiumBox from "../components/PremiumBox";

export default function PDF() {
  const user = useUser();
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const sjekk = async () => {
      if (!user || typeof user !== "object" || !("id" in user)) return;
      const har = await brukerHarPremium(user.id as string);
      setPremium(har);
    };
    sjekk();
  }, [user]);

  const generer = () => {
    const doc = new jsPDF();
    doc.text("Frilansportalen årsoppgjør", 20, 20);
    doc.save("arsoppgjor.pdf");
  };

  if (!premium) {
    return (
      <Layout>
        <Head>
          <title>PDF | Frilansportalen</title>
        </Head>
        <div className="max-w-xl mx-auto py-10">
          <PremiumBox />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Eksporter PDF | Frilansportalen</title>
      </Head>
      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Eksporter årsoppgjør</h1>
        <button
          onClick={generer}
          className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
        >
          Last ned PDF
        </button>
      </div>
    </Layout>
  );
}
