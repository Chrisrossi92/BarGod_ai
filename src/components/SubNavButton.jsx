import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * SubNavButton
 * Props:
 * - to: string (route)
 * - label: string
 * - icon?: ReactNode (optional)
 * - variant?: "primary" | "ghost"
 * - size?: "sm" | "md"
 */
export default function SubNavButton({
  to,
  label,
  icon = null,
  variant = "ghost",
  size = "md",
  className = "",
}) {
  const navigate = useNavigate();

  const base =
    "inline-flex items-center gap-2 rounded-xl border transition focus:outline-none focus:ring-2";
  const sizes =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : "px-4 py-2 text-sm";
  const styles =
    variant === "primary"
      ? "bg-white text-black border-white hover:brightness-95 focus:ring-lime-400"
      : "bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800 focus:ring-zinc-500";

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`${base} ${sizes} ${styles} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
