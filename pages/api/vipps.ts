import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId = "test-001", amount = 10000 } = req.body; // beløp i øre

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

    const response = await fetch(vippsUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
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
          transactionText: "Testbetaling Frilansportalen",
        },
      }),
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Vipps-feil" });
  }
}
