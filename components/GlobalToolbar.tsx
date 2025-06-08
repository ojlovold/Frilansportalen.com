// components/GlobalToolbar.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLayout } from "@/context/LayoutContext";

const getFlagg = (lang: string) => {
  const landkode = lang.split("-")[1]?.toLowerCase() || lang.slice(-2).toLowerCase();
  return String.fromCodePoint(...[...landkode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
};

const unikeSpråk = () => {
  const sett = new Set<string>();
  return typeof window !== "undefined"
    ? window.speechSynthesis.getVoices()
        .filter((v) => {
          if (sett.has(v.lang)) return false;
          sett.add(v.lang);
          return true;
        })
        .map((v) => ({
          kode: v.lang,
          navn: `${getFlagg(v.lang)} ${v.lang}`
        }))
        .sort((a, b) => a.navn.localeCompare(b.navn))
    : [];
};

export default function GlobalToolbar() {
  const { visSprak, setVisSprak, visTale, setVisTale } = useLayout();
  const [sprak, setSprak] = useState("no");
  const [leser, setLeser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lagret = localStorage.getItem("sprak");
      if (lagret) setSprak(lagret);
    }
  }, []);

  const språkTilLangkode = (kode: string) => {
    switch (kode) {
      case "en": return "en-US";
      case "sv": return "sv-SE";
      case "da": return "da-DK";
      case "de": return "de-DE";
      case "fr": return "fr-FR";
      default: return "no-NO";
    }
  };

  const byttSprak = (kode: string) => {
    localStorage.setItem("sprak", kode);
    setSprak(kode);
    setVisSprak(false);
  };

  const lesOpp = () => {
    if (typeof window !== "undefined") {
      const uttale = new SpeechSynthesisUtterance(document.body.innerText);
      uttale.lang = språkTilLangkode(sprak);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(uttale);
      setLeser(true);
      uttale.onend = () => setLeser(false);
    }
  };

  const stoppLesing = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setLeser(false);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-28 z-[9999] flex flex-row-reverse items-center gap-6">
        <Link href="/login" className="hover:opacity-80">
          <img
            src="/A_2D_digital_illustration_features_a_raised,_3D-st.png"
            alt="Logg inn"
            className="h-12 w-12 object-contain"
          />
        </Link>
        <button
          onClick={() => setVisTale(!visTale)}
          className="hover:opacity-80"
          aria-label="Talehjelp"
        >
          <img
            src="/A_3D-rendered_white_icon_in_Norse_or_Viking_style_.png"
            alt="Talehjelp"
            className="h-12 w-12 object-contain"
          />
        </button>
        <button
          onClick={() => setVisSprak(!visSprak)}
          className="hover:opacity-80"
          aria-label="Språkvalg"
        >
          <img
            src="/A_2D_digital_image_features_a_three-dimensional_wh.png"
            alt="Språkvalg"
            className="h-12 w-12 object-contain"
          />
        </button>
      </div>

      {visSprak && (
        <div className="fixed top-20 right-6 z-[9999] bg-black text-yellow-300 p-4 rounded shadow-xl text-sm max-h-[40vh] overflow-y-auto space-y-1">
          <p className="font-bold mb-2">Velg språk:</p>
          {unikeSpråk().map((s) => (
            <button
              key={s.kode}
              onClick={() => byttSprak(s.kode)}
              className="block text-left w-full hover:text-yellow-100"
            >
              {s.navn}
            </button>
          ))}
        </div>
      )}

      {visTale && (
        <div className="fixed top-20 right-6 z-[9999] bg-black text-yellow-300 p-4 rounded shadow-xl text-sm space-y-2">
          <p className="font-bold mb-2">Talehjelp:</p>
          {leser ? (
            <button onClick={stoppLesing}>⏹️ Stopp</button>
          ) : (
            <button onClick={lesOpp}>🔊 Les opp</button>
          )}
        </div>
      )}
    </>
  );
}
