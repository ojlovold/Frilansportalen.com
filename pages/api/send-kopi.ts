import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { melding, fra } = req.body;

  if (!melding || !fra) {
    return res.status(400).json({ error: "Melding eller avsender mangler" });
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "system@frilansportalen.com",
        to: ["ole@frilansportalen.com"],
        subject: "Ny brukerforespørsel",
        html: `<p><strong>Fra:</strong> ${fra}</p><p>${melding}</p>`,
      }),
    });

    res.status(200).json({ status: "Sendt" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
