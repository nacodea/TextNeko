export function camelToSnake(input: string): string {
  // snake_case っぽい場合はそのまま
  if (input.includes("_")) {
    return input;
  }

  return (
    input
      // 大文字 + 小文字の境界: camelCase → camel_Case
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      // 連続した大文字（IDなど）: userID → user_ID
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
      .toLowerCase()
  );
}
