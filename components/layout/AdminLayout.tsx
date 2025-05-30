// components/layout/AdminLayout.tsx

import Head from "next/head";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import useDesignFarger from "@/hooks/useDesignFarger";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();
  const title = pathname.split("/").pop()?.replace(/-/g, " ") ?? "Admin";

  const { bakgrunnsfarge, tekstfarge } = useDesignFarger();

  return (
    <>
      <Head>
        <title>{title} | Frilansportalen Admin</title>
      </Head>
      <main className={`min-h-screen ${bakgrunnsfarge} ${tekstfarge} p-6 max-w-6xl mx-auto`}>
        {pathname !== "/admin" && <TilbakeKnapp />}
        {children}
      </main>
    </>
  );
}
