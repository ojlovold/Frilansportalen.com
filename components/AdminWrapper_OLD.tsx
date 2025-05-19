import Head from "next/head";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AdminWrapper({ title, children }: Props) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>{title} | Frilansportalen Admin</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-6 max-w-6xl mx-auto">
        {pathname !== "/admin" && <TilbakeKnapp />}
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </>
  );
}
