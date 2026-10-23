import type { ReactNode } from "react";
import { tokens } from "../../tokens/textarea";

export interface TextareaTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TextareaTrigger: part of the textarea component. */
export function TextareaTrigger({ children, muted = false }: TextareaTriggerProps) {
  return (
    <div
      className="textarea-trigger"
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
