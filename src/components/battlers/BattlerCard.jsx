import React from "react";
import { Link } from "react-router-dom";
import FocalImage from "@/components/common/FocalImage";


function overallFromStats(stats) {
if (!stats || typeof stats !== "object") return null;
const values = Object.values(stats).filter((v) => typeof v === "number" && !Number.isNaN(v));
if (!values.length) return null;
const avg = values.reduce((a, b) => a + b, 0) / values.length;
return Math.round(avg);
}


export default function BattlerCard({ battler }) {
const overall = Number.isFinite(battler?.overall) ? battler.overall : overallFromStats(battler?.stats);
const fx = Number.isFinite(battler?.photo_focus_x) ? battler.photo_focus_x : 50;
const fy = Number.isFinite(battler?.photo_focus_y) ? battler.photo_focus_y : 35;


return (
<Link
to={`/battlers/${battler.id}`}
className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:bg-zinc-900"
>
<div className="relative">
<FocalImage src={battler.photo_url} alt={battler.name} focusX={fx} focusY={fy} aspect="16/9" />
{Number.isFinite(overall) && (
<span className="absolute bottom-2 right-2 rounded-xl bg-lime-500 px-2 py-1 text-xs font-bold text-black shadow">
{overall}
</span>
)}
</div>


<div className="p-3">
<div className="flex items-center justify-between gap-2">
<h3 className="truncate font-semibold text-white">{battler.name}</h3>
</div>
<div className="mt-1 text-[10px] uppercase tracking-wide text-zinc-400">
{Number.isFinite(overall) ? `Overall ${overall}` : "No ratings yet"}
{Number.isFinite(battler?.rating_count) && ` • ${battler.rating_count} ratings`}
</div>
{battler.bio && (
<p className="mt-1 line-clamp-2 text-xs text-zinc-400">{battler.bio}</p>
)}
</div>
</Link>
);
}

