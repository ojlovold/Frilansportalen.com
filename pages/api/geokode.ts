import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { adresse } = req.query;

  if (!adresse || typeof adresse !== "string") {
    return res.status(400).json({ error: "Adresse mangler eller er ugyldig" });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(adresse)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "frilansportalen/1.0 (kontakt@frilansportalen.com)",
      },
    });

    const data = await response.json();
    if (!data || !data[0]) return res.status(404).json({ error: "Ingen koordinater funnet" });

    const { lat, lon } = data[0];
    res.status(200).json({ lat: parseFloat(lat), lng: parseFloat(lon) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Ukjent feil" });
  }
}
