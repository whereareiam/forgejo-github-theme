import type { ReactNode } from "react";
import { tokens } from "../../tokens/select";

export interface SelectLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SelectLabel: part of the select component. */
export function SelectLabel({ children, muted = false }: SelectLabelProps) {
  return (
    <div
      className="select-label"
      style={{
        color: muted ? "var(--ds-fgColor-muted)" : "var(--ds-fgColor-default)",
        background: muted ? "var(--ds-bgColor-muted)" : "var(--ds-bgColor-default)",
        borderColor: muted ? "var(--ds-borderColor-muted)" : "var(--ds-borderColor-default)",
        padding: "var(--ds-space-4) var(--ds-space-8)",
        gap: "var(--ds-space-2)",
        borderRadius: "var(--ds-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}
