import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const søk = req.query.q;

  if (!søk || typeof søk !== "string" || søk.length < 3) {
    return res.status(400).json({ error: "Minimum 3 tegn kreves for søk" });
  }

  try {
    const brregUrl = `https://data.brreg.no/enhetsregisteret/api/enheter?sok=${encodeURIComponent(søk)}`;
    const response = await fetch(brregUrl);

    if (!response.ok) {
      return res.status(500).json({ error: "Brreg-søk feilet" });
    }

    const data = await response.json();
    res.status(200).json(data._embedded?.enheter || []);
  } catch (error) {
    res.status(500).json({ error: "Ukjent feil", detaljer: error });
  }
}
