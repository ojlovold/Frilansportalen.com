import Head from "next/head";
import Link from "next/link";
import { Store, RefreshCcw } from "lucide-react";

export default function MarkederPage() {
  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Markedsplassen | Frilansportalen</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Velkommen til Markedsplassen</h1>
        <p className="text-lg mb-10">
          Velg hvilken del av markedsplassen du vil utforske:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <Link href="/markeder/sjappa" legacyBehavior>
            <a className="bg-gray-200 rounded-2xl shadow-lg p-6 flex items-center justify-center gap-4 text-lg hover:bg-gray-300 w-full">
              <Store className="text-2xl" /> Sjappa
            </a>
          </Link>

          <Link href="/gjenbruksportalen" legacyBehavior>
            <a className="bg-gray-200 rounded-2xl shadow-lg p-6 flex items-center justify-center gap-4 text-lg hover:bg-gray-300 w-full">
              <RefreshCcw className="text-2xl" /> Gjenbruksportalen
            </a>
          </Link>
        </div>
      </div>
    </main>
  );
}
