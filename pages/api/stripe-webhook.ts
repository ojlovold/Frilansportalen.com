import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import supabase from "@/lib/supabaseClient";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).end("Missing signature");

  let event;
  const buf = await buffer(req);

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata;

    if (!m || !m.bruker_id || (m.type !== "småjobb" && m.type !== "sommerjobb")) {
      return res.status(200).end("Ugyldig eller ikke-dugnad");
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

    if (error) console.error("Feil ved oppretting:", error);
  }

  res.status(200).json({ received: true });
}
