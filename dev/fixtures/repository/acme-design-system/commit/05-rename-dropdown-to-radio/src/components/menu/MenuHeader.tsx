import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuHeader: part of the menu component. */
export function MenuHeader({ children, muted = false }: MenuHeaderProps) {
  return (
    <div
      className="menu-header"
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
