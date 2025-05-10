import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Admin() {
  const [klar, setKlar] = useState(false);
  const [lansert, setLansert] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Adminpanel</h1>

      <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-sm text-yellow-800 rounded">
        Vipps er ikke på plass ennå, men vil bli det snart.
      </div>

      <div className={`mb-6 p-4 rounded text-white text-sm ${
        klar ? "bg-green-600" : "bg-red-600"
      }`}>
        Systemstatus: {klar ? "KLAR FOR LANSERING" : "IKKE KLAR"}
      </div>

      <button
        onClick={() => {
          if (klar) {
            setLansert(true);
          } else {
            setKlar(true);
          }
        }}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 text-sm"
      >
        {klar ? "Start portalen" : "Klargjør for lansering"}
      </button>

      {lansert && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-800 text-sm rounded">
          Portalen er lansert! Gratulerer.
        </div>
      )}
    </Layout>
  );
}
