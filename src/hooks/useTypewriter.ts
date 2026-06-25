import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CHARS_PER_LINE = 48; // approx wrap width, used to trigger the near-margin ding
const LINE_HEIGHT_PX = 39; // matches paper-body line-height at default font size
const VISIBLE_LINES_BEFORE_ADVANCE = 8;

interface UseTypewriterOptions {
  initialText?: string;
  onKey: () => void;
  onSpace: () => void;
  onReturn: () => void;
  onDing: () => void;
  readOnly?: boolean;
}

interface UseTypewriterResult {
  text: string;
  setText: (text: string) => void;
  insertChar: (char: string) => void;
  backspace: () => void;
  paperOffset: number;
}

export function useTypewriter({
  initialText = "",
  onKey,
  onSpace,
  onReturn,
  onDing,
  readOnly = false,
}: UseTypewriterOptions): UseTypewriterResult {
  const [text, setText] = useState(initialText);
  const lastLineLenRef = useRef(0);

  const insertChar = useCallback(
    (ch: string) => {
      if (readOnly) return;
      setText((prev) => prev + ch);
      if (ch === " ") onSpace();
      else if (ch === "\n") onReturn();
      else onKey();
    },
    [onKey, onSpace, onReturn, readOnly]
  );

  const backspace = useCallback(() => {
    if (readOnly) return;
    setText((prev) => prev.slice(0, -1));
  }, [readOnly]);

  // Ring the bell just before the line would need a manual return —
  // mirrors the real-typewriter cue that you're nearing the margin.
  useEffect(() => {
    const lines = text.split("\n");
    const currentLine = lines[lines.length - 1];
    if (
      currentLine.length === CHARS_PER_LINE - 4 &&
      lastLineLenRef.current < currentLine.length
    ) {
      onDing();
    }
    lastLineLenRef.current = currentLine.length;
  }, [text, onDing]);

  const lineCount = useMemo(() => {
    return text.split("\n").reduce((acc, line) => {
      return acc + Math.max(1, Math.ceil(line.length / CHARS_PER_LINE));
    }, 0) || 1;
  }, [text]);

  const paperOffset = useMemo(() => {
    return Math.max(0, (lineCount - VISIBLE_LINES_BEFORE_ADVANCE) * LINE_HEIGHT_PX);
  }, [lineCount]);

  return { text, setText, insertChar, backspace, paperOffset };
}
