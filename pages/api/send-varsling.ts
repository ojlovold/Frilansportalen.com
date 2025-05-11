import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";

// Henter nøkkel fra miljøvariabel – definert i Vercel dashboard
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error("Mangler SENDGRID_API_KEY i miljøvariabler");
}

sgMail.setApiKey(apiKey || ""); // fallback til tomt for å unngå feil

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, error: "Mangler påkrevde felter" });
  }

  try {
    await sgMail.send({
      to,
      from: "varsler@frilansportalen.com", // må være verifisert i SendGrid
      subject,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Feil ved sending av e-post:", error);
    return res.status(500).json({ success: false, error });
  }
}
