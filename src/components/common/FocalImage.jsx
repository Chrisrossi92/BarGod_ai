import React from "react";


export default function FocalImage({ src, alt = "", focusX = 50, focusY = 35, aspect = "16/9", className = "" }) {
return (
<div className={`relative w-full overflow-hidden rounded-xl ${className}`} style={{ aspectRatio: aspect }}>
{src ? (
<img
src={src}
alt={alt}
className="h-full w-full object-cover"
style={{ objectPosition: `${focusX}% ${focusY}%` }}
loading="lazy"
/>
) : (
<div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500 text-xs">No Image</div>
)}
<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/55" />
</div>
);
}
