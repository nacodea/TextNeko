export function snakeToCamel(input: string): string {
  if (!input.includes("_")) return input;

  return input
    .replace(/^_+/, "") // 先頭の _ を除去
    .toLowerCase()
    .replace(/_+([a-z0-9])/g, (_, c) => c.toUpperCase());
}
