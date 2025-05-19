import Head from "next/head";
import useDesignFarger from "@/hooks/useDesignFarger";
import Link from "next/link";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const { bakgrunnsfarge, tekstfarge } = useDesignFarger();

  return (
    <div className={`min-h-screen ${bakgrunnsfarge} ${tekstfarge}`}>
      <Head>
        <title>Dashboard | Frilansportalen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="bg-black text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Frilansportalen</Link>
        </h1>
        <nav className="flex space-x-4 text-sm">
          <Link href="/admin" className="hover:underline">Admin</Link>
          <Link href="/stillinger" className="hover:underline">Stillinger</Link>
          <Link href="/marked" className="hover:underline">Marked</Link>
        </nav>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
