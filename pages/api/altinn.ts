import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import https from "https";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { base64pdf, filename } = req.body;

  const buffer = Buffer.from(base64pdf, "base64");
  const tempPath = path.join("/tmp", filename || "rapport.pdf");
  fs.writeFileSync(tempPath, buffer);

  const options = {
    hostname: "tt02.altinn.no",
    port: 443,
    path: "/api/serviceengine/submission", // Fiktiv endpoint – må erstattes med faktisk tjeneste
    method: "POST",
    headers: {
      "X-Token": process.env.ALTINN_API_KEY!,
      "X-Org": "935411343", // Organisasjonsnummer
      "Content-Type": "application/pdf",
      "Content-Length": buffer.length,
    },
    cert: fs.readFileSync(path.join(process.cwd(), "cert/altinn.pem")), // Lagre sertifikatet her
  };

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => res.status(response.statusCode || 200).send(data));
  });

  request.on("error", (e) => {
    console.error("Altinn-feil:", e);
    res.status(500).json({ error: e.message });
  });

  request.write(buffer);
  request.end();
}
