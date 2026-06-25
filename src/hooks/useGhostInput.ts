import { useEffect, useRef } from "react";

interface UseGhostInputOptions {
  disabled: boolean;
  onChar: (char: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
}

/**
 * Captures typing through a visually-hidden <input> rather than a global
 * keydown listener. Printable characters are read from the native `input`
 * event (works correctly with virtual keyboards, IME composition, and
 * autocomplete — none of which reliably produce a usable `key` value on
 * keydown). Backspace and Enter are caught on keydown since an empty
 * input field won't fire an `input` event for them.
 */
export function useGhostInput({
  disabled,
  onChar,
  onBackspace,
  onReturn,
}: UseGhostInputOptions) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const val = target.value;
      if (val) {
        for (const ch of val) onChar(ch);
        target.value = "";
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        onBackspace();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onReturn();
      }
    };

    el.addEventListener("input", handleInput);
    el.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("keydown", handleKeyDown);
    };
    // Re-run when `disabled` flips (e.g. a shared letter becomes editable),
    // since the input element only exists in the DOM once enabled.
  }, [disabled, onChar, onBackspace, onReturn]);

  const refocus = () => {
    if (!disabled) inputRef.current?.focus();
  };

  return { inputRef, refocus };
}
