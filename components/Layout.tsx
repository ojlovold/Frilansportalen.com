import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import TilbakeKnapp from "./TilbakeKnapp";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const visTilbake = !["/", "/dashboard"].includes(router.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="bg-black text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Frilansportalen</Link>
        </h1>
        <nav className="flex space-x-4 text-sm">
          <Link href="/stillinger" className="hover:underline">Stillinger</Link>
          <Link href="/tjenester" className="hover:underline">Tjenester</Link>
          <Link href="/marked" className="hover:underline">Marked</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        </nav>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        {visTilbake && (
          <div className="mb-4">
            <TilbakeKnapp />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
