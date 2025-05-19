// components/layout/AdminLayout.tsx
import Head from "next/head";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();
  const title = pathname.split("/").pop()?.replace(/-/g, " ") ?? "Admin";

  return (
    <>
      <Head>
        <title>{title} | Frilansportalen Admin</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-6 max-w-6xl mx-auto">
        {pathname !== "/admin" && <TilbakeKnapp />}
        <h1 className="text-3xl font-bold mb-6 capitalize">{title}</h1>
        {children}
      </main>
    </>
  );
}
