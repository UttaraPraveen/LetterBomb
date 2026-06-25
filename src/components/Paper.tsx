import { useRef } from "react";
import { motion } from "framer-motion";
import type { Theme, LetterHeader } from "../types/letter";
import { TypedText } from "./TypedText";
import { Cursor } from "./Cursor";

interface PaperProps {
  theme: Theme;
  text: string;
  cursorVisible: boolean;
  paperOffset: number;
  playInsertAnimation: boolean;
  readOnly: boolean;
  headerOverride?: LetterHeader;
}

export function Paper({
  theme,
  text,
  cursorVisible,
  paperOffset,
  playInsertAnimation,
  readOnly,
  headerOverride,
}: PaperProps) {
  // Framer Motion only reads `initial` on the component's first render, so
  // whether to play the slide-up insertion animation must be captured once
  // at mount rather than derived from state that can change afterward.
  const playInsertRef = useRef(playInsertAnimation);

  const headerLeft = headerOverride?.left ?? theme.headerLeft;
  const headerRight = headerOverride?.right ?? theme.headerRight;

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(640px,92vw)] h-full overflow-hidden pointer-events-none z-10">
      <motion.div
        className="letter-paper absolute left-0 right-0 top-0 min-h-[1400px] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.45)]"
        style={{
          backgroundColor: theme.paperColor,
          clipPath:
            "path('M 0 26 C 60 2, 580 2, 640 26 L 640 1400 L 0 1400 Z')",
          backgroundImage: [
            "radial-gradient(circle at 18% 8%, rgba(0,0,0,0.05), transparent 40%)",
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0px, transparent 1px, transparent 3px)",
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0px, transparent 1px, transparent 3px)",
          ].join(", "),
        }}
        initial={playInsertRef.current ? { y: 900, rotate: -1.5 } : false}
        animate={{ y: -paperOffset, rotate: 0 }}
        transition={
          playInsertRef.current
            ? { type: "spring", stiffness: 60, damping: 14, mass: 1 }
            : { type: "spring", stiffness: 120, damping: 18 }
        }
      >
        <div
          className="flex justify-between px-[46px] pt-[38px] pb-[14px] font-mono text-[13px] tracking-wide border-b lowercase"
          style={{ color: theme.inkFaded, borderColor: "rgba(0,0,0,0.18)" }}
        >
          <span>{headerLeft}</span>
          <span>{headerRight}</span>
        </div>

        <div
          className="px-[46px] pt-[30px] font-typewriter text-[19px] leading-[2.05] whitespace-pre-wrap break-words min-h-[520px]"
          style={{ color: theme.ink }}
        >
          <TypedText text={text} />
          {!readOnly && <Cursor visible={cursorVisible} color={theme.ink} />}
        </div>
      </motion.div>
    </div>
  );
}
