import React from "react";
export default function Card({ className="", ...props }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 ${className}`} {...props}/>
  );
}
