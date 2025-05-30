import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, kontekst = "Du hjelper brukere på Frilansportalen." } = req.body;

  if (!prompt) return res.status(400).json({ error: "Mangler prompt" });

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: kontekst },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const result = await openaiRes.json();
    const forslag = result.choices?.[0]?.message?.content || "Ingen svar.";
    res.status(200).json({ forslag });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "AI-feil" });
  }
}
