import Head from "next/head";
import Layout from "../components/Layout";
import AccessibilityPanel from "../components/AccessibilityPanel";
import { useState } from "react";

export default function Taletest() {
  const [tekst, setTekst] = useState("");

  return (
    <Layout>
      <Head>
        <title>Taletest | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Test tale-til-tekst og tekst-til-tale</h1>

      <div className="max-w-xl grid gap-4">
        <label className="block text-sm">
          Skriv eller dikter noe:
          <textarea
            className="mt-1 p-2 border rounded w-full h-24 resize-none"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
          />
        </label>

        <AccessibilityPanel tekst={tekst} onDiktert={(verdi) => setTekst(verdi)} />
      </div>
    </Layout>
  );
}
