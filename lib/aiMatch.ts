export function aiMatch(input: string): string[] {
  const synonymMap: Record<string, string[]> = {
    sokker: ["klær", "undertøy"],
    jakke: ["klær", "yttertøy"],
    bukse: ["klær"],
    kopp: ["kjøkken", "servering"],
    bord: ["møbler"],
    lampe: ["lys", "interiør"],
    hjelm: ["beskyttelse", "sykkel"],
    sykkel: ["transport", "utstyr"],
  };

  const ord = input.toLowerCase();
  return synonymMap[ord] || [ord];
}
