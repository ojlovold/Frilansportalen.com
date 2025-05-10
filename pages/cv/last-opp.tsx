import Head from "next/head";
import Layout from "../../components/Layout";
import FileUploadCV from "../../components/FileUploadCV";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function LastOppCV() {
  const [filUrl, setFilUrl] = useState("");
  const [sendt, setSendt] = useState(false);
  const router = useRouter();

  const send = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("cv").insert({
      fil: filUrl,
      opprettet_av: id,
    });

    if (!error) setSendt(true);
  };

  return (
    <Layout>
      <Head>
        <title>Last opp CV | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Last opp CV</h1>

      {sendt ? (
        <p className="bg-green-100 border border-green-400 text-green-800 p-4 rounded text-sm">
          CV lagret!
        </p>
      ) : (
        <div className="max-w-lg">
          <FileUploadCV onUpload={(url) => setFilUrl(url)} />
          <button
            onClick={send}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            disabled={!filUrl}
          >
            Lagre CV
          </button>
        </div>
      )}
    </Layout>
  );
}
