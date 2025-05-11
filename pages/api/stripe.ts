import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "Mangler bruker-ID" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "nok",
            unit_amount: 10000,
            product_data: {
              name: "Premium-medlemskap",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bruker_id: userId,
        type: "premium",
      },
      success_url: `https://frilansportalen.com/premium?status=success`,
      cancel_url: `https://frilansportalen.com/premium?status=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
