export const trimEachLine = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .join("\n");
