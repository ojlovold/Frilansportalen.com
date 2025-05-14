import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Push-endepunkt aktivert:", req.method);

  if (req.method === "GET") {
    return res.status(200).json({ message: "Push-endepunktet svarer!" });
  }

  if (req.method !== "POST") return res.status(405).end();

  const { filnavn, innhold, commitMelding } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = "ojlovold/Frilansportalen.com";
  const branch = "main";

  try {
    // 1. Lag blob
    const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: Buffer.from(innhold).toString("base64"),
        encoding: "base64",
      }),
    });
    const blob = await blobRes.json();
    console.log("Blob:", blob);
    if (!blob.sha) throw new Error("Kunne ikke opprette blob");

    // 2. Hent HEAD-ref
    const refRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/${branch}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const refData = await refRes.json();
    console.log("Ref:", refData);
    if (!refData.object?.sha) throw new Error("Kunne ikke hente ref sha");

    // 3. Lag nytt tre
    const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_tree: refData.object.sha,
        tree: [
          {
            path: filnavn,
            mode: "100644",
            type: "blob",
            sha: blob.sha,
          },
        ],
      }),
    });
    const tree = await treeRes.json();
    console.log("Tree:", tree);
    if (!tree.sha) throw new Error("Kunne ikke opprette tree");

    // 4. Lag commit
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMelding,
        tree: tree.sha,
        parents: [refData.object.sha],
      }),
    });
    const commit = await commitRes.json();
    console.log("Commit:", commit);
    if (!commit.sha) throw new Error("Kunne ikke opprette commit");

    // 5. Oppdater HEAD
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sha: commit.sha }),
    });
    const update = await updateRes.json();
    console.log("Update:", update);
    if (!update.object?.sha) throw new Error("Kunne ikke oppdatere HEAD");

    return res.status(200).json({
      message: "Push utført",
      commitSha: commit.sha,
    });
  } catch (err: any) {
    console.error("Feil i push-handler:", err.message || err);
    return res.status(500).json({ error: "Push feilet", details: err.message || err });
  }
}
