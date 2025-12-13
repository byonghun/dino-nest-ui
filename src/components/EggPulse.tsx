import { motion } from "framer-motion";

type EggPulseProps = {
  triggerKey: number;
};

export function EggPulse({ triggerKey }: EggPulseProps) {
  return (
    <motion.div
      key={triggerKey}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1.1, opacity: 0.18 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute inset-0 rounded-full bg-emerald-500 blur-2xl"
    />
  );
}
