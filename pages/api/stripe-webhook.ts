import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabase } from "../../utils/supabaseClient";
import { lagKvittering } from "../../utils/lagKvittering";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const rawBodyBuffer = async (req: any) => {
  return await new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    req.on("data", (chunk: any) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"]!;
  const buf = await rawBodyBuffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bruker_id = session.metadata?.bruker_id;

      if (bruker_id) {
        await supabase.from("profiler").update({ premium: true }).eq("id", bruker_id);
        await lagKvittering(bruker_id, "Premium-medlemskap", 100);
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook-feil:", err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
}
