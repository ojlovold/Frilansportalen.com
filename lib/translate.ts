// lib/translate.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cache = new Map<string, string>();

export async function translateTekst(
  tekst: string,
  til: string = "en"
): Promise<string> {
  const nøkkel = tekst + "->" + til;
  if (cache.has(nøkkel)) return cache.get(nøkkel)!;

  const prompt = `Oversett følgende tekst til ${til}:
"""
${tekst}
"""`;

  const svar = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Du er en profesjonell oversetter." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  const oversatt = svar.choices[0].message.content?.trim() || tekst;
  cache.set(nøkkel, oversatt);
  return oversatt;
}
