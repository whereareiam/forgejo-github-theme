import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuGroup: part of the menu component. */
export function MenuGroup({ children, muted = false }: MenuGroupProps) {
  return (
    <div
      className="menu-group"
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
