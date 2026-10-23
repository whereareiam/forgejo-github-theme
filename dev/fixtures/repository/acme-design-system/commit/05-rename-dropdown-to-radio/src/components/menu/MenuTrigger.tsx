import type { ReactNode } from "react";
import { tokens } from "../../tokens/menu";

export interface MenuTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuTrigger: part of the menu component. */
export function MenuTrigger({ children, muted = false }: MenuTriggerProps) {
  return (
    <div
      className="menu-trigger"
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
