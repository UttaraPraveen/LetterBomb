import { motion } from "framer-motion";

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <motion.div
      className="absolute top-[22px] left-1/2 -translate-x-1/2 px-[18px] py-2.5 rounded-lg text-[13px] shadow-2xl z-[60]"
      style={{
        background: "rgba(20,24,18,0.94)",
        border: "1px solid rgba(237,231,212,0.2)",
        color: "#ece7d4",
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
    >
      {message}
    </motion.div>
  );
}
