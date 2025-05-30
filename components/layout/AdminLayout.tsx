// components/layout/AdminLayout.tsx

import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import useDesignFarger from "@/hooks/useDesignFarger";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { bakgrunnsfarge, tekstfarge } = useDesignFarger();

  return (
    <>
      <Head>
        <title>Frilansportalen Admin</title>
      </Head>
      <main className={`min-h-screen ${bakgrunnsfarge} ${tekstfarge} p-6 max-w-6xl mx-auto`}>
        <Link href="/admin" className="text-blue-700 underline block mb-6">
          ← Til admin
        </Link>
        {children}
      </main>
    </>
  );
}
