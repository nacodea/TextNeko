export type TransformGroup = "none" | "case" | "width" | "slug";

export type TransformOption =
  | "snakeToCamel"
  | "camelToSnake"
  | "upper"
  | "lower"
  | "zenToHan"
  | "hanToZen"
  | "slugify"
  | null;

export type Preset = {
  id: string;
  name: string;
  transform: {
    group: TransformGroup;
    option: TransformOption;
  };
};
