import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuContent: part of the menu component. */
export function MenuContent({ children, muted = false }: MenuContentProps) {
  return (
    <div
      className="menu-content"
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
