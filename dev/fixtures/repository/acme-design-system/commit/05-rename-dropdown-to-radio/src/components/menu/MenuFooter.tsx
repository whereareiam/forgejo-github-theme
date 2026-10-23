import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuFooter: part of the menu component. */
export function MenuFooter({ children, muted = false }: MenuFooterProps) {
  return (
    <div
      className="menu-footer"
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
