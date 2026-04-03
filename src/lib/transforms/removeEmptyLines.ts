export const removeEmptyLines = (text: string) =>
  text
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
    .join("\n");
