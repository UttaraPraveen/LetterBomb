import { useEffect, useState } from "react";

export function useCursorBlink(enabled: boolean, intervalMs = 530): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setVisible((v) => !v), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return enabled ? visible : false;
}
