export function SectionCard({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      {children}
    </section>
  );
}

export function StatPill({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="text-lg font-black text-white">{value}</div>
    </div>
  );
}
