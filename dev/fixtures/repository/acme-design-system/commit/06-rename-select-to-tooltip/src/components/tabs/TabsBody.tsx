import type { ReactNode } from "react";
import { tokens } from "../../tokens/tabs";

export interface TabsBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TabsBody: part of the tabs component. */
export function TabsBody({ children, muted = false }: TabsBodyProps) {
  return (
    <div
      className="tabs-body"
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
