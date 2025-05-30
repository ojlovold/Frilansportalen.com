import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient"; // ← FIKSET

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error("Stripe-nøkler mangler i miljøvariabler");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Mangler eller ugyldig stripe-signature");
  }

  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret as string);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata;

    if (!m || !m.bruker_id || (m.type !== "småjobb" && m.type !== "sommerjobb")) {
      return res.status(200).end("Ikke relevant annonsetype");
    }

    const { error } = await supabase.from("dugnader").insert([
      {
        opprettet_av: m.bruker_id,
        type: m.type,
        tittel: m.tittel,
        beskrivelse: m.beskrivelse,
        kategori: m.kategori,
        sted: m.sted,
        frist: m.frist,
      },
    ]);

    if (error) {
      console.error("Feil ved oppretting:", error);
      return res.status(500).json({ error: "Kunne ikke lagre dugnad" });
    }

    const belop = m.type === "sommerjobb" ? 100 : 50;
    const tekst = `Kvittering for betaling\n\nType: ${m.type}\nTittel: ${m.tittel}\nBeløp: ${belop} kr\nDato: ${new Date().toLocaleString("no-NO")}`;
    const filnavn = `kvittering_${m.type}_${Date.now()}.txt`;
    const sti = `kvitteringer/${m.bruker_id}/${filnavn}`;

    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(sti, tekst, {
        contentType: "text/plain",
      });

    if (uploadError) {
      console.error("Kunne ikke lagre kvittering:", uploadError);
    }
  }

  res.status(200).json({ received: true });
}
