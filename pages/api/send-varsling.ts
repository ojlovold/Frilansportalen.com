import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error("Mangler SENDGRID_API_KEY i miljøvariabler");
} else {
  sgMail.setApiKey(apiKey);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, error: "Mangler påkrevde felter" });
  }

  if (!apiKey) {
    return res.status(500).json({ success: false, error: "Manglende SendGrid API-nøkkel" });
  }

  try {
    await sgMail.send({
      to,
      from: "varsler@frilansportalen.com", // Må være verifisert i SendGrid
      subject,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Feil ved sending av e-post:", error?.response?.body || error.message || error);
    return res.status(500).json({ success: false, error: error?.message || "Ukjent feil" });
  }
}
