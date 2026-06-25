import { useState } from "react";
import { motion } from "framer-motion";
import type { Theme } from "../types/letter";

type Stage = "closed" | "opening" | "sliding" | "done";

interface EnvelopeRevealProps {
  theme: Theme;
  onRevealed: () => void;
}

export function EnvelopeReveal({ theme, onRevealed }: EnvelopeRevealProps) {
  const [stage, setStage] = useState<Stage>("closed");

  const handleClick = () => {
    if (stage !== "closed") return;
    setStage("opening");
    window.setTimeout(() => setStage("sliding"), 700);
    window.setTimeout(() => {
      setStage("done");
      onRevealed();
    }, 1900);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: theme.bgGradient,
        cursor: stage === "closed" ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <div className="relative w-80 h-[220px]">
        {/* envelope body */}
        <motion.div
          className="absolute inset-0 rounded-md shadow-2xl"
          style={{ background: theme.paperColor }}
          animate={stage === "sliding" || stage === "done" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        />

        {/* envelope flap */}
        <motion.div
          className="absolute top-0 left-0 w-80 h-[110px] z-[3]"
          style={{
            background: theme.paperHeaderColor,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "top center",
          }}
          animate={
            stage === "closed"
              ? { rotateX: 0 }
              : { rotateX: 180, opacity: stage === "done" ? 0 : 1 }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* letter sliding out */}
        <motion.div
          className="absolute left-[30px] right-[30px] top-3.5 h-[260px] rounded shadow-xl z-[2]"
          style={{ background: "#fbf8f0" }}
          initial={{ y: 0 }}
          animate={
            stage === "sliding" || stage === "done"
              ? { y: -240, opacity: stage === "done" ? 0 : 1 }
              : { y: 0 }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {stage === "closed" && (
        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 text-[13px] tracking-[1.5px] uppercase text-[rgba(237,231,212,0.6)]">
          click to open
        </div>
      )}
    </div>
  );
}
