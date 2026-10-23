import type { ReactNode } from "react";
import { tokens } from "../../tokens/text";

export interface TextItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TextItem: part of the text component. */
export function TextItem({ children, muted = false }: TextItemProps) {
  return (
    <div
      className="text-item"
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
