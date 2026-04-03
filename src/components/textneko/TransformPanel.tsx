import { cn } from "@/lib/utils";

export function TransformPanel({
  title,
  children,
  className,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-background", className)}>
      {/* header */}
      <div className="px-4 py-2 border-b font-semibold bg-gray-100">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
