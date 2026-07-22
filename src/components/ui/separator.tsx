import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SeparatorProps = ComponentProps<"div"> & {
  readonly orientation?: "horizontal" | "vertical";
};

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="separator"
      role="separator"
      className={cn(
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        "shrink-0 bg-border",
        className,
      )}
      {...props}
    />
  );
}
