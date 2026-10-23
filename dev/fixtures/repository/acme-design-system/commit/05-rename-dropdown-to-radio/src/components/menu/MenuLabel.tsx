import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuLabel: part of the menu component. */
export function MenuLabel({ children, muted = false }: MenuLabelProps) {
  return (
    <div
      className="menu-label"
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
