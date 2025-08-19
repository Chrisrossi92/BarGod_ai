import React from "react";

const styles = {
  primary: "bg-white text-black border-white hover:brightness-95",
  ghost:   "bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800",
  danger:  "bg-red-500 text-white border-red-500 hover:bg-red-600",
};

export default function Button({
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}) {
  const sz = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl border transition 
                  focus:outline-none focus:ring-2 focus:ring-lime-400 ${styles[variant]} ${sz} ${className}`}
      {...props}
    />
  );
}
