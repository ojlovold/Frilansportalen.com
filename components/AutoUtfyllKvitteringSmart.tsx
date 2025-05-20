// components/AutoUtfyllKvitteringSmart.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AutoUtfyllKvitteringSmart({ rolle }: { rolle: "admin" | "bruker" }) {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");
  const [tittelKandidater, setTittelKandidater] = useState<string[]>([]);
  const [belopKandidater, setBelopKandidater] = useState<string[]>([]);
  const [datoKandidater, setDatoKandidater] = useState<string[]>([]);
  const [valutaKandidater, setValutaKandidater] = useState<string[]>([]);

  const forbedreKontrast = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      const brightness = 0.34 * r + 0.5 * g + 0.16 * b;
      const high = brightness > 128 ? 255 : 0;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = high;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const pdfTilBilde = async (pdfFile: File): Promise<HTMLCanvasElement> => {
    const typedarray = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    const side = await pdf.getPage(1);
    const scale = 3;
    const viewport = side.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await side.render({ canvasContext: context, viewport }).promise;
    forbedreKontrast(canvas);
    return canvas;
  };

  const bildeTilCanvas = async (fil: File): Promise<HTMLCanvasElement> => {
    return await new Promise((resolve) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(fil);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        forbedreKontrast(canvas);
        resolve(canvas);
      };
    });
  };

  const tolkTekstSmart = (tekst: string) => {
    const linjer = tekst.toLowerCase().split("\n").map((l) => l.trim()).filter(Boolean);

    const tittelKandidater = linjer.filter(
      (l) =>
        (l.includes("frilansportalen") || l.includes("domene") || l.includes("as") || l.includes("faktura")) &&
        !l.includes("status") &&
        !l.includes("kopi") &&
        !l.includes("last ned")
    );

    const belopKandidater = linjer
      .filter((l) =>
        /(kr|beløp|sum|total|å betale|faktura|inkl)/.test(l) &&
        /[0-9\s.,]+/.test(l) &&
        !/(konto|kid|iban)/.test(l)
      )
      .flatMap((l) => {
        const matches = [...l.matchAll(/(?:kr\s*)?([0-9\s.,]+)(?=\s*[,–-]?$)/gi)];
        return matches.map((m) =>
          m[1]
            .replace(/[^
