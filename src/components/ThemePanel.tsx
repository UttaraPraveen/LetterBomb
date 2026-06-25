import { motion } from "framer-motion";
import { THEMES } from "../themes/themes";

interface ThemePanelProps {
  currentId: string;
  onSelect: (id: string) => void;
}

export function ThemePanel({ currentId, onSelect }: ThemePanelProps) {
  return (
    <motion.div
      className="absolute top-[70px] right-7 w-[230px] rounded-xl p-3.5 backdrop-blur-md shadow-2xl"
      style={{
        background: "rgba(20,24,18,0.92)",
        border: "1px solid rgba(237,231,212,0.18)",
      }}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <p className="text-[11px] tracking-[2px] uppercase text-[rgba(237,231,212,0.5)] font-medium mb-2.5">
        Choose a machine
      </p>
      {THEMES.map((t) => {
        const active = t.id === currentId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13.5px] transition-colors " +
              (active
                ? "bg-[rgba(237,231,212,0.14)] text-[#ece7d4]"
                : "text-[rgba(237,231,212,0.78)] hover:bg-[rgba(237,231,212,0.08)]")
            }
          >
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{
                background: t.paperColor,
                boxShadow: `inset 0 0 0 2px ${t.machineBody}`,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            />
            <span>{t.label}</span>
          </div>
        );
      })}
    </motion.div>
  );
}
