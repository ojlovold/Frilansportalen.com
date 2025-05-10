import Header from "./Header";
import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="flex flex-col min-h-screen bg-portalGul text-black">
        <Header />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
        <footer className="bg-black text-white text-sm py-4 text-center mt-8">
          Frilansportalen © {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
}
