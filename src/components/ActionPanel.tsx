import { motion } from "framer-motion";

interface ActionPanelProps {
  onShare: () => void;
  onDownloadImage: () => void;
  onDownloadPdf: () => void;
}

export function ActionPanel({ onShare, onDownloadImage, onDownloadPdf }: ActionPanelProps) {
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
        Send it onward
      </p>
      <button
        onClick={onShare}
        className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg text-[13.5px] text-[rgba(237,231,212,0.78)] hover:bg-[rgba(237,231,212,0.08)] transition-colors"
      >
        <span>🖇</span>
        <span>Copy share link</span>
      </button>
      <button
        onClick={onDownloadImage}
        className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg text-[13.5px] text-[rgba(237,231,212,0.78)] hover:bg-[rgba(237,231,212,0.08)] transition-colors"
      >
        <span>🖼</span>
        <span>Save as image</span>
      </button>
      <button
        onClick={onDownloadPdf}
        className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg text-[13.5px] text-[rgba(237,231,212,0.78)] hover:bg-[rgba(237,231,212,0.08)] transition-colors"
      >
        <span>📄</span>
        <span>Save as PDF</span>
      </button>
    </motion.div>
  );
}
