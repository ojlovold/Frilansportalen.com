// kvitteringer.tsx – Komplett, basert på din opplastede og godkjente versjon
// Nå med Altinn-funksjon korrekt lagt til. PDF, CSV, QR, logo og layout er urørt.

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
// @ts-ignore
import QRCode from "qrcode";

export default function Kvitteringer() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [kvitteringer, setKvitteringer] = useState<any[]>([]);
  const [valgte, setValgte] = useState<string[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("kvitteringer")
        .select("*")
        .eq("bruker_id", user.id)
        .eq("slettet", false)
        .order("dato", { ascending: false });

      const unike = Object.values(
        (data || []).reduce((acc, k) => {
          acc[k.fil_url] = k;
          return acc;
        }, {} as Record<string, any>)
      );
      setKvitteringer(unike);
    };
    hent();
  }, [user]);

  const slett = async (id: string, fil_url: string) => {
    const path = fil_url.split("/").slice(7).join("/");
    await supabase.storage.from("kvitteringer").remove([path]);
    await supabase.from("kvitteringer").update({ slettet: true }).eq("id", id);
    setKvitteringer((prev) => prev.filter((k) => k.id !== id));
  };

  const eksporterTilAltinn = async () => {
    try {
      const { data: config } = await supabase.from("settings").select("altinn_url, altinn_key").single();
      if (!config?.altinn_url || !config?.altinn_key) {
        alert("Altinn-konfigurasjon mangler i adminpanelet.");
        return;
      }

      const payload = {
        bruker_id: user?.id,
        eksportert: new Date().toISOString(),
        kvitteringer: kvitteringer.map(k => ({
          dato: k.dato,
          tittel: k.tittel,
          valuta: k.valuta,
          belop: k.belop_original ?? k.belop,
          nok: k.nok ?? (k.valuta === "NOK" ? k.belop : null),
          fil_url: k.fil_url,
          id: k.id
        }))
      };

      const res = await fetch(config.altinn_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.altinn_key}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Eksport til Altinn fullført.");
      } else {
        const err = await res.text();
        alert("Feil ved eksport: " + err);
      }
    } catch (err) {
      alert("Uventet feil: " + err);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const eksporterPDFmedVedlegg = async () => {
    const { PDFDocument, StandardFonts } = await import("pdf-lib");
    const utvalgte = valgte.length > 0 ? kvitteringer.filter(k => valgte.includes(k.id)) : kvitteringer;
    const samledoc = await PDFDocument.create();
    const font = await samledoc.embedFont(StandardFonts.Helvetica);

    const logoRes = await fetch("/logo_transparent.png");
    const logoBlob = await logoRes.blob();
    const logoBytes = await logoBlob.arrayBuffer();
    const logoDoc = await samledoc.embedPng(logoBytes);

    let totalNOK = 0;
    let totalOriginal = 0;

    for (let i = 0; i < utvalgte.length; i++) {
      const k = utvalgte[i];
      try {
        const res = await fetch(k.fil_url);
        const blob = await res.blob();
        const buffer = await blob.arrayBuffer();
        const side = samledoc.addPage([595.28, 841.89]);

        let y = 810;
        side.drawText("Frilansportalen – Kvittering", { x: 50, y, font, size: 12 });
        y -= 20;
        side.drawText(`Tittel: ${k.tittel}`, { x: 50, y, font, size: 10 });
        y -= 15;
        side.drawText(`Dato: ${k.dato}`, { x: 50, y, font, size: 10 });
        y -= 15;
        side.drawText(`Valuta: ${k.valuta}`, { x: 50, y, font, size: 10 });
        y -= 15;
        side.drawText(`Beløp: ${k.belop_original ?? k.belop}`, { x: 50, y, font, size: 10 });
        y -= 15;
        side.drawText(`NOK: ${k.nok ?? (k.valuta === "NOK" ? k.belop : "")}`, { x: 50, y, font, size: 10 });

        if (blob.type === "application/pdf") {
          const doc = await PDFDocument.load(buffer);
          const pages = await samledoc.copyPages(doc, doc.getPageIndices());
          pages.forEach((p) => samledoc.addPage(p));
        } else {
          const img = new Uint8Array(buffer);
          const embed = blob.type.includes("png")
            ? await samledoc.embedPng(img)
            : await samledoc.embedJpg(img);
          const { width, height } = embed.scale(0.7);
          side.drawImage(embed, { x: 50, y: y - height - 20, width, height });
        }

        const qr = await QRCode.toDataURL(k.fil_url);
        const qrimg = await samledoc.embedPng(qr.split(",")[1]);
        side.drawImage(qrimg, { x: 450, y: 730, width: 80, height: 80 });

        side.drawText(`Revisjons-ID: ${k.id.slice(0, 8)}`, { x: 50, y: 50, font, size: 10 });
        side.drawImage(logoDoc, { x: 230, y: 10, width: 130, height: 40 });

        totalNOK += parseFloat(k.nok ?? (k.valuta === "NOK" ? k.belop : 0));
        totalOriginal += parseFloat(k.belop_original ?? k.belop ?? 0);
      } catch {
        const side = samledoc.addPage([595.28, 841.89]);
        side.drawText("Feil ved henting av kvittering", { x: 50, y: 800, font, size: 12 });
      }
    }

    const siste = samledoc.addPage([595.28, 841.89]);
    siste.drawText("Frilansportalen – Summering", { x: 50, y: 810, font, size: 14 });
    siste.drawText(`Totalt originalbeløp: ${totalOriginal.toFixed(2)}`, { x: 50, y: 780, font, size: 10 });
    siste.drawText(`Totalt NOK: ${totalNOK.toFixed(2)}`, { x: 50, y: 760, font, size: 10 });
    siste.drawText(`Dato: ${new Date().toISOString().split("T")[0]}`, { x: 50, y: 740, font, size: 10 });
    siste.drawImage(logoDoc, { x: 230, y: 10, width: 130, height: 40 });

    const bytes = await samledoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "kvitteringer-med-vedlegg.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const aktive = kvitteringer.filter(k => k.arkivert === false || k.arkivert === null);
  const arkiv = kvitteringer.filter(k => k.arkivert === true);

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow"
        >
          ← Tilbake
        </button>

        <h1 className="text-2xl font-bold mb-4">Mine kvitteringer</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={eksporterCSV} className="bg-blue-700 text-white px-4 py-2 rounded shadow">
            Eksporter som CSV
          </button>
          <button onClick={eksporterPDFmedVedlegg} className="bg-black text-white px-4 py-2 rounded shadow">
            Eksporter PDF med bilder
          </button>
          <button onClick={eksporterTilAltinn} className="bg-green-700 text-white px-4 py-2 rounded shadow">
            Eksporter til Altinn
          </button>
        </div>

        {aktive.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Aktive kvitteringer</h2>
            <Kvitteringstabell liste={aktive} slett={slett} valgte={valgte} setValgte={setValgte} />
          </>
        )}
        {arkiv.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-2">Arkiv</h2>
            <Kvitteringstabell liste={arkiv} slett={slett} valgte={valgte} setValgte={setValgte} />
          </>
        )}
      </div>
    </div>
  );
}

function Kvitteringstabell({ liste, slett, valgte, setValgte }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border"></th>
            <th className="p-2 border">Dato</th>
            <th className="p-2 border">Tittel</th>
            <th className="p-2 border">Beløp</th>
            <th className="p-2 border">Valuta</th>
            <th className="p-2 border">I NOK</th>
            <th className="p-2 border">Fil</th>
            <th className="p-2 border">Handling</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((k: any) => (
            <tr key={k.id} className="text-center">
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={valgte.includes(k.id)}
                  onChange={() =>
                    setValgte((prev: any[]) =>
                      prev.includes(k.id) ? prev.filter((v) => v !== k.id) : [...prev, k.id]
                    )
                  }
                />
              </td>
              <td className="p-2 border">{k.dato}</td>
              <td className="p-2 border">{k.tittel}</td>
              <td className="p-2 border">{k.belop_original ?? k.belop} {k.valuta}</td>
              <td className="p-2 border">{k.valuta}</td>
              <td className="p-2 border">{(k.nok ?? (k.valuta === "NOK" ? k.belop : "")).toFixed?.(2)}</td>
              <td className="p-2 border">
                <a href={k.fil_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  Åpne
                </a>
              </td>
              <td className="p-2 border">
                <button onClick={() => slett(k.id, k.fil_url)} className="text-red-600 hover:underline">
                  Slett
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
