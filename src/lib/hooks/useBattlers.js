// src/lib/hooks/useBattlers.js
import { useEffect, useState } from "react";
import { listBattlers } from "@/lib/battlersApi";
import archetypes from "@/logic/archetypes";
import { cities } from "@/components/therise/hometown/cityData";

function mapRowToBuild(row) {
  const archetypeData = row.archetype
    ? archetypes[row.archetype]
    : null;
  const city = row.hometown
    ? cities.find((c) => c.id === row.hometown)
    : null;
  const hometownLabel = city?.name || null;
  const attrs = row.attributes || row.base_attributes || {};

  const signature = [];

  // Pull out 2–3 strongest stats as “signature” tags
  const entries = Object.entries(attrs);
  if (entries.length > 0) {
    const top = [...entries]
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .slice(0, 3);
    top.forEach(([key]) => {
      const labelMap = {
        punchlines: "Punchlines",
        schemes: "Schemes",
        angles: "Angles",
        rebuttals: "Rebuttals",
        freestyle: "Freestyle",
        presence: "Presence",
        crowdControl: "Crowd Control",
        delivery: "Delivery",
      };
      signature.push(labelMap[key] || key);
    });
  }

  return {
    id: row.id,
    name: row.name,
    archetypeId: row.archetype || null,
    archetypeLabel: archetypeData?.name || row.archetype || "Unknown archetype",
    hometownLabel,
    ovr: row.ovr ?? 60,
    level: row.level ?? 1,
    xp: row.xp ?? 0,
    signature,
    attributes: attrs,
    color: undefined, // no longer used directly now that BattlerCard has gradients
  };
}

export default function useBattlers() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const rows = await listBattlers();
        if (!active) return;
        const mapped = rows.map(mapRowToBuild);
        setBuilds(mapped);
      } catch (e) {
        console.error(e);
        if (active) setError(e.message || "Failed to load battlers");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { builds, loading, error };
}
