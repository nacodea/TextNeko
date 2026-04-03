"use client";

import { useTextStore } from "@/store/useTextStore";
import clsx from "clsx";

export function TransformChecks() {
  const { transform, setTransform } = useTextStore();

  return (
    <div className="space-y-4 mt-2">
      {/* ===== Case変換 ===== */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="radio"
            checked={transform.group === "case"}
            onChange={() => setTransform("case", "snakeToCamel")}
          />
          Case変換
        </label>

        <div className="ml-6 flex flex-wrap gap-1 rounded-md border bg-muted/30 p-1">
          {[
            ["snakeToCamel", "snake → camel"],
            ["camelToSnake", "camel → snake"],
            ["upper", "大文字"],
            ["lower", "小文字"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={clsx(
                "w-36 text-center cursor-pointer rounded-md border px-2 py-0.5 text-xs transition",
                transform.option === value &&
                  transform.group === "case" &&
                  "bg-primary text-primary-foreground",
                transform.group !== "case" && "opacity-40 pointer-events-none",
              )}
            >
              <input
                type="radio"
                className="sr-only"
                checked={transform.option === value}
                onChange={() => setTransform("case", value as any)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ===== 全角/半角変換 ===== */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="radio"
            checked={transform.group === "width"}
            onChange={() => setTransform("width", "zenToHan")}
          />
          全角/半角変換
        </label>

        <div className="ml-6 flex flex-wrap gap-1 rounded-md border bg-muted/30 p-1">
          {[
            ["zenToHan", "全角 → 半角"],
            ["hanToZen", "半角 → 全角"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={clsx(
                "w-36 text-center cursor-pointer rounded-md border px-2 py-0.5 text-xs transition",
                transform.option === value &&
                  transform.group === "width" &&
                  "bg-primary text-primary-foreground",
                transform.group !== "width" && "opacity-40 pointer-events-none",
              )}
            >
              <input
                type="radio"
                className="sr-only"
                checked={transform.option === value}
                onChange={() => setTransform("width", value as any)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ===== スラッグ ===== */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="radio"
            checked={transform.group === "slug"}
            onChange={() => setTransform("slug", "slugify")}
          />
          スラッグ化
        </label>

        <div className="ml-6 flex gap-1 rounded-md border bg-muted/30 p-1">
          <span
            className={clsx(
              "w-36 text-center rounded-md border px-2 py-0.5 text-xs",
              transform.group === "slug"
                ? "bg-primary text-primary-foreground"
                : "opacity-40",
            )}
          >
            日本語 → 英字
          </span>
        </div>
      </div>
    </div>
  );
}
