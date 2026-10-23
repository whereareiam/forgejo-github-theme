import type { ReactNode } from "react";
import { tokens } from "../../tokens/tabs";

export interface TabsTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TabsTrigger: part of the tabs component. */
export function TabsTrigger({ children, muted = false }: TabsTriggerProps) {
  return (
    <div
      className="tabs-trigger"
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
