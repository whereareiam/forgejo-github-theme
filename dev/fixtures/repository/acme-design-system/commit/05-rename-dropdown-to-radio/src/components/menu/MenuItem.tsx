import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuItem: part of the menu component. */
export function MenuItem({ children, muted = false }: MenuItemProps) {
  return (
    <div
      className="menu-item"
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
