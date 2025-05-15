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
  const baseBranch = "main";
  const branch = `push/${filnavn.replace(/\W/g, "-")}-${Date.now()}`;

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // 1. Hent SHA fra main
    const refRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/${baseBranch}`, { headers });
    const ref = await refRes.json();
    const baseSha = ref.object.sha;

    // 2. Lag branch
    await fetch(`https://api.github.com/repos/${repo}/git/refs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: baseSha,
      }),
    });

    // 3. Lag blob
    const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        content: Buffer.from(innhold).toString("base64"),
        encoding: "base64",
      }),
    });
    const blob = await blobRes.json();

    // 4. Lag tree
    const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tree: [
          {
            path: filnavn,
            mode: "100644",
            type: "blob",
            sha: blob.sha,
          },
        ],
        base_tree: baseSha,
      }),
    });
    const tree = await treeRes.json();

    // 5. Lag commit
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: commitMelding,
        tree: tree.sha,
        parents: [baseSha],
      }),
    });
    const commit = await commitRes.json();

    // 6. Oppdater branch med ny commit
    await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sha: commit.sha }),
    });

    // 7. Opprett pull request
    const prRes = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: commitMelding,
        head: branch,
        base: baseBranch,
        body: `Automatisk opprettet PR for ${filnavn}`,
      }),
    });
    const pr = await prRes.json();

    return res.status(200).json({
      message: "Pull request opprettet",
      pullRequestUrl: pr.html_url,
    });
  } catch (err: any) {
    console.error("Feil i push-handler:", err.message || err);
    return res.status(500).json({ error: "Push feilet", details: err.message || err });
  }
}
