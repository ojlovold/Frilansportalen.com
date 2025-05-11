import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const { belop, metadata } = req.body;

  if (!belop || !metadata || !metadata.bruker_id) {
    return res.status(400).json({ error: "Ugyldig data" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "nok",
            product_data: {
              name: metadata.type === "sommerjobb" ? "Sommerjobbannonse" : "Småjobbannonse",
            },
            unit_amount: belop * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dugnadsportalen?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dugnadsportalen?cancelled=true`,
      metadata: {
        bruker_id: metadata.bruker_id,
        type: metadata.type,
        tittel: metadata.tittel,
        beskrivelse: metadata.beskrivelse,
        kategori: metadata.kategori,
        sted: metadata.sted,
        frist: metadata.frist,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe-feil:", err);
    return res.status(500).json({ error: "Stripe-feil" });
  }
}
