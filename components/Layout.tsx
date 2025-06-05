// components/Layout.tsx

import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visSprak, setVisSprak] = useState(false);
  const [visTale, setVisTale] = useState(false);

  const visPiler =
    typeof window !== "undefined" &&
    !["/", "/dashboard"].includes(window.location.pathname);

  return (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      {/* Ikoner oppe til høyre */}
      <div className="fixed top-4 right-6 z-50 flex flex-row-reverse items-center gap-4">
        <Link href="/login" className="hover:opacity-80">
          <img
            src="/A_2D_digital_illustration_features_a_raised,_3D-st.png"
            alt="Logg inn"
            className="h-10 max-w-[48px] object-contain"
          />
        </Link>

        <button
          title="Talehjelp"
          onClick={() => setVisTale((v) => !v)}
          className="hover:opacity-80"
        >
          <img
            src="/A_3D-rendered_white_icon_in_Norse_or_Viking_style_.png"
            alt="Talehjelp"
            className="h-10 max-w-[48px] object-contain"
          />
        </button>

        <button
          title="Språkvalg"
          onClick={() => setVisSprak((v) => !v)}
          className="hover:opacity-80"
        >
          <img
            src="/A_2D_digital_image_features_a_three-dimensional_wh.png"
            alt="Språk"
            className="h-10 max-w-[48px] object-contain"
          />
        </button>
      </div>

      {/* Flytende paneler */}
      {visSprak && (
        <div className="fixed top-20 right-6 z-50 bg-black text-yellow-300 p-4 rounded shadow-xl text-sm space-y-2">
          <p className="font-bold mb-2">Velg språk:</p>
          <button onClick={() => alert("Set language: no")}>🇳🇴 Norsk</button>
          <button onClick={() => alert("Set language: en")}>🇬🇧 Engelsk</button>
          <button onClick={() => alert("Set language: sv")}>🇸🇪 Svensk</button>
          <button onClick={() => alert("Set language: da")}>🇩🇰 Dansk</button>
          <button onClick={() => alert("Set language: de")}>🇩🇪 Tysk</button>
          <button onClick={() => alert("Set language: fr")}>🇫🇷 Fransk</button>
        </div>
      )}

      {visTale && (
        <div className="fixed top-20 right-6 z-50 bg-black text-yellow-300 p-4 rounded shadow-xl text-sm">
          <p className="font-bold mb-2">Talehjelp:</p>
          <button onClick={() => alert("Les opp siden")}>🔊 Les opp</button>
          <button onClick={() => alert("Start diktering")}>🎙️ Start diktering</button>
        </div>
      )}

      {visPiler && (
        <div className="absolute top-6 left-6 z-50">
          <TilbakeKnapp retning="venstre" className="w-12 h-12" />
        </div>
      )}

      {visPiler && (
        <div className="absolute top-6 right-6 z-50">
          <TilbakeKnapp retning="høyre" className="w-12 h-12" />
        </div>
      )}

      <main className="p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
