import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt mangler" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Du hjelper brukere på Frilansportalen." },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const forslag = data.choices?.[0]?.message?.content || "Ingen svar fra AI.";
    res.status(200).json({ forslag });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "AI-feil" });
  }
}
