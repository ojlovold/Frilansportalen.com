import Head from "next/head";
import Layout from "../../components/Layout";
import { useState } from "react";

export default function NyTjeneste() {
  const [sendt, setSendt] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Ny tjeneste | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Registrer tjeneste</h1>

      {sendt ? (
        <div className="bg-green-100 border border-green-400 text-green-800 rounded p-4 text-sm">
          Takk! Tjenesten er sendt inn og vil vises etter godkjenning.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSendt(true);
          }}
          className="grid gap-4 max-w-lg"
        >
          <input required type="text" placeholder="Navn" className="p-2 border rounded" />
          <input required type="text" placeholder="Tjeneste (f.eks. Frisør)" className="p-2 border rounded" />
          <input required type="text" placeholder="Sted" className="p-2 border rounded" />
          <textarea required placeholder="Kort beskrivelse" className="p-2 border rounded h-32 resize-none"></textarea>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
            Registrer
          </button>
        </form>
      )}
    </Layout>
  );
}
