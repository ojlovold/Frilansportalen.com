import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import TilbakeKnapp from "@/components/TilbakeKnapp";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Skjul layout på admin login-siden
  if (router.asPath === "/admin/logginn") return <>{children}</>;

  // Skjul piler på forsiden og dashboard
  const visPiler = !["/", "/dashboard"].includes(router.asPath);

  return (
    <div className="min-h-screen bg-gray-50 text-black relative">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* VENSTRE PIL – tilbake */}
      {visPiler && (
        <div className="absolute top-6 left-6 z-50">
          <TilbakeKnapp retning="venstre" className="w-12 h-12" />
        </div>
      )}

      {/* HØYRE PIL – fremover */}
      {visPiler && (
        <div className="absolute top-6 right-6 z-50">
          <TilbakeKnapp retning="høyre" className="w-12 h-12" />
        </div>
      )}

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
        {children}
      </main>
    </div>
  );
}
