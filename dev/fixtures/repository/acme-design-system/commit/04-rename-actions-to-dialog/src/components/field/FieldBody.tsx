import type { ReactNode } from "react";
import { tokens } from "../../tokens/field";

export interface FieldBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** FieldBody: part of the field component. */
export function FieldBody({ children, muted = false }: FieldBodyProps) {
  return (
    <div
      className="field-body"
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
