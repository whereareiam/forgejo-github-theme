import type { ReactNode } from "react";
import { tokens } from "../../tokens/checkbox";

export interface CheckboxFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CheckboxFooter: part of the checkbox component. */
export function CheckboxFooter({ children, muted = false }: CheckboxFooterProps) {
  return (
    <div
      className="checkbox-footer"
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
