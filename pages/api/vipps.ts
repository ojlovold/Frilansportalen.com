import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId = "test-001", amount = 10000 } = req.body;

  const vippsUrl = "https://apitest.vipps.no/ecomm/v2/payments";
  const tokenUrl = "https://apitest.vipps.no/accesstoken/get";

  const clientId = process.env.VIPPS_CLIENT_ID!;
  const clientSecret = process.env.VIPPS_CLIENT_SECRET!;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY!;

  try {
    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "client_id": clientId,
        "client_secret": clientSecret,
        "grant_type": "client_credentials",
      },
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const bruker = await supabase.auth.getUser();
    const brukerId = bruker.data.user?.id;

    const response = await fetch(vippsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "application/json",
        "Merchant-Serial-Number": "370544"
      },
      body: JSON.stringify({
        customerInfo: {
          mobileNumber: "4741515280", // testbruker
        },
        merchantInfo: {
          callbackPrefix: "https://frilansportalen.com/api/vipps",
          fallBack: "https://frilansportalen.com/betaling",
          consentRemovalPrefix: "https://frilansportalen.com/betaling",
        },
        transaction: {
          orderId,
          amount,
          transactionText: "Premium-medlemskap",
        },
      }),
    });

    const result = await response.json();

    // Hvis det er en Premium-bestilling, aktiver premium i profilen
    if (orderId.startsWith("premium-") && brukerId) {
      await supabase.from("profiler").update({ premium: true }).eq("id", brukerId);
    }

    res.status(200).json({ ...result, info: "Premium aktivert" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Vipps-feil" });
  }
}
