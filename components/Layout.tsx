import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visSprak, setVisSprak] = useState(false);
  const [visTale, setVisTale] = useState(false);
  const [sprak, setSprak] = useState("no");
  const [stemmer, setStemmer] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const lagret = localStorage.getItem("sprak");
    if (lagret) setSprak(lagret);

    const updateVoices = () => setStemmer(window.speechSynthesis.getVoices());
    if (typeof window !== "undefined" && window.speechSynthesis) {
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const byttSprak = (kode: string) => {
    localStorage.setItem("sprak", kode);
    setSprak(kode);
    router.push(router.pathname, router.asPath, { locale: kode });
  };

  const lesOpp = () => {
    const uttale = new SpeechSynthesisUtterance(document.body.innerText);
    uttale.lang = sprak;
    const valgt = stemmer.find((v) => v.lang === sprak);
    if (valgt) uttale.voice = valgt;
    window.speechSynthesis.speak(uttale);
  };

  const visPiler =
    typeof window !== "undefined" &&
    !["/", "/dashboard"].includes(window.location.pathname);

  return (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      {/* Øvre ikonrekke */}
      <div className="fixed top-4 right-28 z-50 flex flex-row-reverse items-center gap-6">
        <Link href="/login" className="hover:opacity-80">
          <img
            src="/A_2D_digital_illustration_features_a_raised,_3D-st.png"
            alt="Logg inn"
            className="h-12 max-w-[60px] object-contain"
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
            className="h-12 max-w-[60px] object-contain"
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
            className="h-12 max-w-[60px] object-contain"
          />
        </button>
      </div>

      {/* Språkvelger */}
      {visSprak && (
        <div className="fixed top-20 right-6 z-50 bg-black text-yellow-300 p-4 rounded shadow-xl text-sm max-h-[60vh] overflow-y-auto space-y-1">
          <p className="font-bold mb-2">Velg språk:</p>
          {stemmer.map((v) => (
            <button
              key={v.lang + v.name}
              onClick={() => byttSprak(v.lang)}
              className="block text-left w-full hover:text-yellow-100"
            >
              {v.name} ({v.lang})
            </button>
          ))}
        </div>
      )}

      {/* Talehjelp */}
      {visTale && (
        <div className="fixed top-20 right-6 z-50 bg-black text-yellow-300 p-4 rounded shadow-xl text-sm space-y-2">
          <p className="font-bold mb-2">Talehjelp:</p>
          <button onClick={lesOpp}>🔊 Les opp</button>
        </div>
      )}

      {/* Navigasjonspiler */}
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

      {/* Innhold */}
      <main className="p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
